import React, {Component} from 'react';
import {Alert,Platform, StyleSheet, View, StatusBar} from 'react-native';
import {
  Content, 
  Fab, 
  Button, 
  Icon, 
  Spinner, 
  ListItem, 
  Left, 
  Body, 
  Right, 
  Thumbnail, 
  Text } from "native-base"
import axios from "axios";

import ListItems from "./component/ListItems"

export default class Homescreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      materi : [],
      loading: false
    }
  }

  makeRemoteRequest = () => {
    this.setState({loading:true})
    setTimeout(() => {
      axios.get(`http://ec2-3-81-168-96.compute-1.amazonaws.com/api/materi`)
      .then(res => {
        const materi = res.data.data;
        console.log(materi);
        this.setState({
          materi,
          loading:false,
        })
      })
      .catch(err => {
        throw err;
      });
    }, 1500)
  }

  componentDidMount(){
    this.makeRemoteRequest()
  } 


  handlePostClick = (nama, email, nomor) => {
    axios.post('http://192.168.0.23:5000/contact', {
      nama,email,nomor
    })
    .then((response) => {
      const newData = this.state.data.concat(response.data);
      this.setState({
        data : newData
      })
      this.props.navigation.popToTop()
    })
    .catch((error) => {
      throw error
    });
  }

  handleDelete = (id, index) => {
    axios.delete(`http://192.168.0.23:5000/contact/${id}`)
    .then(res => {
      const newData = this.state.data.concat();
      newData.splice(index, 1);

      this.setState({
        data : newData
      })
    })
    .catch(err => {
      throw err;
    });
  }

  handleEdit = (nama,email,nomor,id) => {
    axios.put(`http://192.168.0.23:5000/contact/edit/${id}`, {
      nama,email,nomor
    })
    .then((response) => {
      this.setState({
        data : response.data,
      })
      this.props.navigation.popToTop()
    })
    .catch((error) => {
      throw error
    });
  }

  handleLoadMore = () => {
    this.setState({
      page : this.state.page + 1
    }, () => {
      this.makeRemoteRequest()
    })
  }

  renderFooter = () => {
    if(this.state.loading === false) return null;

    return (
        <View>
          <Spinner color='#1e88e5' />
          <Text 
            style={{color:"#aaa", fontSize:12, textAlign:'center', bottom:10}}
          >
            Load more data
          </Text>
        </View>
    )
  }

  renderList = (item,index) => {
    return(
      <ListItem 
            style={{marginRight:20}}
            avatar 
            key={index}
            onPress = {
              () => this.props.navigation.navigate("Edit", {
                                                            id : item._id,
                                                            handleEdit : this.handleEdit
                                                           }
                                                  )
            } 
            onLongPress={() => Alert.alert(
              'Are you sure',
              'you want to delete this contact ?',
              [
                {text: 'Cancel', onPress: () => null},
                {text: 'OK', onPress: () => this.handleDelete(item._id, index)},
              ],
              { cancelable: false }
            )}>
            <Left>
              <Thumbnail style={{backgroundColor:"#1e88e5"}} source={{ uri: item.thumbnail }} />
            </Left>
            <Body>
              <Text note>{item.title}</Text>
              <Text note>{item.content}</Text>
            </Body>
          </ListItem>
    )
  }

  render() {
    const {nama, email,nomor} = this.state
    return (
      <View style={styles.container}>
        <StatusBar 
          backgroundColor="#1e88e5"
          barStyle="light-content"
        />

        <View style={{flex: 1}}>
            <ListItems 
              {...this.props}
              data={this.state.materi}
              handleDelete={this.handleDelete}
              handleEdit={this.handleEdit}
              handleLoadMore={this.handleLoadMore}
              renderFooter={this.renderFooter}
              renderList = {this.renderList}
            />
        </View>

        <Fab
            style={{ backgroundColor: '#1e88e5' }}
            position="bottomRight"
            onPress={() => this.props.navigation.navigate("add", {
                                                                  handlePostClick:this.handlePostClick
                                                                })}>
            <Icon type="FontAwesome" name="pencil" />
        </Fab>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }
});
