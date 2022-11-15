import { useEffect } from "react";
import LoginComponent from "../../components/Login";
import { NextSeo } from "next-seo";
import Router from 'next/router'
import { host_uri, client_id } from '../../config';

const Login = ({ isLoggedIn }) => {
    useEffect(() => {
        if (process.browser) {
            if (isLoggedIn === 'true') {
                return Router.push('/registry');
            } else if (isLoggedIn === 'false') {
                window.location.href = `https://login.elixir-czech.org/oidc/authorize?response_type=token id_token&scope=openid profile email eduperson_entitlement ga4gh_passport_v1&client_id=${client_id}&state=StAtE&redirect_uri=${host_uri}`;
            }
        }
    }, [isLoggedIn]);

    return (
        <>
            <NextSeo title="Login Registry" description="ELIXIR Cloud & AAI latest news/twitter feed." />
            <LoginComponent />
        </>
    );
};

export default Login;
