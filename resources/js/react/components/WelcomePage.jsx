import {gql, useQuery} from "@apollo/client";
import React, {useState} from 'react';
import {Loading} from '@shopify/app-bridge-react';
import {Banner} from "@shopify/polaris";

const PRODUCTS_QUERY = gql`{
  products(first: 10) {
    edges {
      cursor
      node {
        id,
        title,
        onlineStoreUrl
      }
    }
  }
}`;

const WelcomePage =() => {
    const {Loading, error, data} = useQuery(PRODUCTS_QUERY);

    // Board State
    const [board, setBoard] = useState(0);

    if (Loading) return (
        <loading/>
    );

    if (error) return (
        <Banner status="critical">
            There was an issue loading products.
        </Banner>
    );

    return (
        <div className="p-8 space-y-8">
            {/* App Heading */}
            <h1 className="text-4xl font-semibold tracking-wider">Trello Sync</h1>

            {/* Combo Box */}
            <select name="" id="" onChange={(event) => setBoard(event.target.value)}>
                <option value="id1">Item 1</option>
                <option value="id2">Item 2</option>
                <option value="id3">Item 3</option>
            </select>

            {/* Combo Box Value */}
            {board}
        </div>
    );
}

export default WelcomePage;
