import React, {Component} from "react";
import {createStackNavigator} from "react-navigation-stack";
import { createAppContainer } from 'react-navigation';
import Homescreen from "../home/Homescreen.js"
import Addscreen from "../add/Addscreen.js"
import Editscreen from "../edit/Editscreen.js"
 
const RootStack = createStackNavigator(
	{
		home : {
			screen : Homescreen,
			navigationOptions: ({ navigation }) => ({
		      title: "Contact List",
		    }),
		},
		add : {
			screen : Addscreen,
			navigationOptions: ({ navigation }) => ({
		      header : null
		    }),
		},
		edit : {
			screen : Editscreen,
			navigationOptions: ({ navigation }) => ({
		      header : null
		    }),
		}
	},
	{
    initialRouteName: 'home',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#1e88e5',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        left : 107,
      },
    },
  }
)

export default createAppContainer(RootStack);