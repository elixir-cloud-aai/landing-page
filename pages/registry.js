import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import Router, { useRouter } from 'next/router';
import axios from "axios";

const Registry = ({ }) => {

    const { asPath } = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState('loading');
    const [userData, setUserData] = useState({});

    function arr2obj(arr) {
        const obj = {};
        arr.forEach((v) => {
            let key = v[0];
            const value = v[1];
            obj[key] = value;
        });
        return obj;
    }

    useEffect(() => {
        const hash = asPath.split('#')[1];
        const params = new URLSearchParams(hash);
        let param = [...params.entries()];
        if (!param || param.length === 0) {
            param = JSON.parse(localStorage.getItem('params'));
        } else {
            param = arr2obj(param);
            localStorage.setItem('params', JSON.stringify(param));
            Router.push('/registry');
        }
        if (!param) {
            setIsLoggedIn('false');
        } else {
            setIsLoggedIn('loading');
            (async function () {
                try {
                    const response = await axios.get(
                        'https://login.elixir-czech.org/oidc/userinfo',
                        {
                            headers: {
                                Authorization: `Bearer ${param.access_token}`
                            }
                        }
                    );
                    localStorage.setItem('user', JSON.stringify(response.data));
                    // setUserData(response.data);
                    setIsLoggedIn('true');
                } catch (e) {
                    localStorage.removeItem('params');
                    setIsLoggedIn('false');
                }
            })();
        }
    }, []);

    return (
        <>
            <NextSeo title="Registry" description="ELIXIR Cloud & AAI latest news/twitter feed." />
        </>
    );
};

export default Registry;
