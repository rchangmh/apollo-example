import React from 'react'
import { render } from 'react-dom'

import ApolloClient from 'apollo-boost'
import { ApolloProvider, Query } from 'react-apollo'
import gql from 'graphql-tag'

const client = new ApolloClient({
  uri: `https://w5xlvm3vzz.lp.gql.zone/graphql`,
})

// Fetch GraphQL data with plain JS
client
  .query({
    query: gql`
      {
        rates(currency: "USD") {
          currency
        }
      }
    `,
  })
  .then(({ data }) => console.log({ data }))

// Fetch GraphQL data with a Query component
const ExchangeRates = () => (
  <Query
    query={gql`
      {
        rates(currency: "USD") {
          currency
          rate
        }
      }
    `}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>Error :(</p>

      return data.rates.map(({ currency, rate }) => (
        <div key={currency}>
          <p>{`${currency}: ${rate}`}</p>
        </div>
      ))
    }}
  </Query>
)

class ExchangeRateComponent extends React.Component {
  state = {
    response_data: null,
  }

  componentDidMount = async () => {
    let response = await client.query({
      query: gql`
        {
          rates(currency: "USD") {
            currency
            rate
          }
        }
      `,
    })
    await this.setState({ response_data: response.data })
  }

  render() {
    return (
      <div>
        {this.state.response_data &&
          this.state.response_data.rates.map(({ currency, rate }) => (
            <div key={currency}>
              <p>{`${currency}: ${rate}`}</p>
            </div>
          ))}
      </div>
    )
  }
}

const App = props => (
  <ApolloProvider client={client}>
    <div>
      {props.value === 'react' ? (
        <div>
          <h1>React.Component 🚀</h1>
          <ExchangeRateComponent />
        </div>
      ) : (
        <div>
          <h1>Query Component 🚀</h1>
          <ExchangeRates />
        </div>
      )}
    </div>
  </ApolloProvider>
)

render(<App value="react" />, document.getElementById('root'))
