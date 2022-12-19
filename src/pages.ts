/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerResponse } from 'http'

import { GetServerSideProps, GetServerSidePropsContext } from 'next'

export type PagesRestrictionsConfig = {
  accessTokenKey: string
  refreshTokenKey: string
  handleRefresh: (res: ServerResponse, refreshToken: string) => any
}

export class PagesRestrictions {
  private accessTokenKey: string
  private refreshTokenKey: string
  private handleRefresh: PagesRestrictionsConfig['handleRefresh']

  constructor(config: PagesRestrictionsConfig) {
    this.accessTokenKey = config.accessTokenKey
    this.refreshTokenKey = config.refreshTokenKey
    this.handleRefresh = config.handleRefresh
  }

  private checkSession = async (context: GetServerSidePropsContext) => {
    const accessToken = context.req?.cookies?.[this.accessTokenKey]
    const refreshToken = context.req?.cookies?.[this.refreshTokenKey]

    if (!refreshToken) return false

    /**
     * Refresh token!
     */
    if (!accessToken) {
      try {
        await this.handleRefresh(context.res, refreshToken)
      } catch (error) {
        return false
      }
    }

    return !!accessToken && !!refreshToken
  }

  public withSessionRefresh = <P extends { [key: string]: any } = any>(
    getServerSideProps: GetServerSideProps<P> = async () => ({ props: {} as P })
  ): GetServerSideProps<P> => {
    return async (context) => {
      await this.checkSession(context)

      return await getServerSideProps(context)
    }
  }

  public withRestriction = <P extends { [key: string]: any } = any>(
    shouldRedirect: (hasSession: boolean) => string | false,
    getServerSideProps: GetServerSideProps<P> = async () => ({ props: {} as P })
  ): GetServerSideProps<P> => {
    return async (context) => {
      const hasSession = await this.checkSession(context)

      let destination = shouldRedirect(hasSession)

      // will redirect because there was no session
      if (!hasSession && destination) {
        destination = destination.includes('?')
          ? `${destination}&returnTo=${context.resolvedUrl}`
          : `${destination}?returnTo=${context.resolvedUrl}`
      }

      if (destination) {
        return {
          redirect: {
            destination,
            permanent: false,
          },
        }
      }

      return await getServerSideProps(context)
    }
  }
}
