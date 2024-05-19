import {NextApiRequest as OriginalNextApiRequest, PreviewData} from 'next';
import type {GetServerSidePropsContext as OriginalGetServerSidePropsContext, GetServerSidePropsResult} from 'next/types';
import {ParsedUrlQuery} from 'querystring';

declare module 'next' {
    export interface NextApiRequest extends OriginalNextApiRequest {
        isAuthenticated: boolean
    }

    export type GetServerSidePropsContext<
        Params extends ParsedUrlQuery = ParsedUrlQuery,
        Preview extends PreviewData = PreviewData
    > = OriginalGetServerSidePropsContext & {
        req: OriginalGetServerSidePropsContext['req'] & {
            isAuthenticated: boolean
        }
    }

    export type GetServerSideProps<
        P extends { [key: string]: any } = { [key: string]: any },
        Q extends ParsedUrlQuery = ParsedUrlQuery,
        D extends PreviewData = PreviewData
    > = (context: GetServerSidePropsContext<Q, D>) => Promise<GetServerSidePropsResult<P>>;
}