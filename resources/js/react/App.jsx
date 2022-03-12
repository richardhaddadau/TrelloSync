import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from "react-router-dom";

import {Redirect} from "@shopify/app-bridge/actions";
import {authenticatedFetch} from "@shopify/app-bridge-utils"
import {AppProvider} from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import {Provider, useAppBridge} from '@shopify/app-bridge-react';

import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client';
import {ApolloProvider} from '@apollo/client/react';
import '@shopify/polaris/dist/styles.css';

import ClientRouter from "./components/ClientRouter";
import PageLayout from "./components/PageLayout";
import AppNavigation from "./components/AppNavigation";
import WelcomePage from "./components/WelcomePage";

import '../../../public/css/app.css';

function userLoggedInFetch(app) {
    const fetchFunction = authenticatedFetch(app);

    return async (uri, options) => {
        const response = await fetchFunction(uri, options);

        if (response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1") {
            const authUrlHeader = response.headers.get("X-Shopify-API-Request-Failure-Reauthorize-Url");

            const redirect = Redirect.create(app);
            redirect.dispatch(Redirect.Action.APP, authUrlHeader);
            return null;
        }

        return response;
    };
}

function AppBridgeApolloProvider({children}) {
    const app = useAppBridge();
    const client = new ApolloClient({
        link: new HttpLink({
            credentials: 'same-origin',
            fetch: userLoggedInFetch(app),
            uri: '/graphql'
        }),
        cache: new InMemoryCache()
    });

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
}

function AboutPage() {
    return (
        <div>
            <h1>About Trello Sync</h1>
        </div>
    );

}

function App({shop, host, apiKey}) {
    const config = {apiKey: apiKey, shopOrigin: shop, host: host, forceRedirect: true};

    return (
        <BrowserRouter>
            <Provider config={config}>
                <ClientRouter/>
                <AppProvider i18n={translations}>
                    <AppBridgeApolloProvider>
                        <AppNavigation/>
                        <PageLayout>
                            <Switch>
                                <Route path="/about" component={AboutPage}/>
                                <Route path="/" component={WelcomePage}/>
                            </Switch>
                        </PageLayout>
                    </AppBridgeApolloProvider>
                </AppProvider>
            </Provider>
        </BrowserRouter>
    );
}

export default App;

let appElement = document.getElementById('app');
if (appElement) {
    ReactDOM.render(<App {...(appElement.dataset)}/>, appElement);
}
