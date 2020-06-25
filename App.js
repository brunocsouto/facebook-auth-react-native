import React, { Component } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { LoginButton, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

const instructions = Platform.select({
  ios: `Press Cmd+R to reload,\nCmd+D or shake for dev menu`,
  android: `Double tap R on your keyboard to reload,\nShake or press menu button for dev menu`,
});

export default class App extends Component {
  state = {
    loading: false,
    user: null
  }

  getUserCallback = (error, result) => {
    if (error) {
      console.log('getUserError', error);
    } else {
      this.setState({ user: result, loading: false });
    }
  }

  getUserInfo = (token) => {
    const infoRequest = new GraphRequest(
      '/me',
      {
        accessToken: token,
        parameters: {
          fields: { string: 'email, name' }
        }
      },
      this.getUserCallback
    );

    new GraphRequestManager().addRequest(infoRequest).start();
  }

  render() {
    return (

      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {this.state.loading && <ActivityIndicator />}
          {this.state.user && <>
            <Text style={styles.userName}>{this.state.user.name}</Text>
            <Text style={styles.userEmail}>{this.state.user.email}</Text>
          </>}
        </View>

        <LoginButton
          permissions={['public_profile', 'email']}
          onLoginFinished={async (error, result) => {
            if (error) {
              console.log('auth error', error);
            } else if (result.isCancelled) {
              console.log('isCancelled');
            } else {
              const { accessToken } = await AccessToken.getCurrentAccessToken();

              this.setState({ loading: true });
              this.getUserInfo(accessToken);
            }
            
          }}
          onLogoutFinished={() => {
            this.setState({user: null});
          }}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  },
  userName: {
    fontWeight: "bold",
    fontSize: 18,
    color: '#333'
  },
  userEmail: {
    fontSize: 14,
    color: '#666'
  }
});
