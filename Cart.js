import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    Alert,
    Modal,

    FlatList,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    AsyncStorage
} from 'react-native';
import Button from 'react-native-button';
const window = Dimensions.get('window');
import store from 'react-native-simple-store';

const GLOBAL = require('./Global');
import { TextField } from 'react-native-material-textfield';
type Props = {};

let customDatesStyles = [];

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            recognized: '',
            started: '',
            prices:'',
            text :'',
            department :[],
            speciality :[],
            hospital:[],
            price:[],
            myprice:'',
            results: [],
            images: [
                {
                    days :'10.00',
                    selected:'',
                },
                {
                    days :'10.15',
                    selected:'',
                },
                {
                    days :'10.15',
                    selected:'',
                },
                {
                    days :'10.23',
                    selected:'',
                },
                {
                    days :'10.33',
                    selected:'',
                },
                {
                    days :'10.56',
                    selected:'',
                },
                {
                    days :'10.66',
                    selected:'',
                },
            ]

        };

    }

    componentWillUnmount() {

    }

    fetchSpeciality = (res,type,depart) => {
        var myArray = [];
        var speciality = '';
        if (res == null || res.length == 0) {
            this.fetchHospital(res,type,depart,'')
        } else {
            var array = res[0].array
            for (var i = 0; i < array.length; i++) {
                if (array[i].selected == "Y") {
                    speciality = speciality + array[i].id + ','
                    myArray.push(array[i])

                }
            }
            speciality = speciality.slice(0, -1);

            store.get('hospital')
                .then((res) =>
                    //  alert(JSON.stringify(res))
                    this.fetchHospital(res,type,depart,speciality)
                )

        }
        this.setState({speciality:myArray})

    }
    fetchHospital = (res,type,depart,speciality) =>{
        var myArray = [];
        var hospital = '';
        if (res == null || res.length == 0) {
            this.setState({hospital:[]})

        } else {
            var array = res[0].array
            for (var i = 0; i < array.length; i++) {
                if (array[i].selected == "Y") {
                    hospital = hospital + array[i].id + ','
                    myArray.push(array[i])
                }
            }
            this.setState({hospital: myArray})
            hospital = hospital.slice(0, -1);
        }

        const url =  GLOBAL.BASE_URL  + 'fetch_nearest_doctor'

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },


            body: JSON.stringify({
                "user_id":GLOBAL.user_id,
                "lat":GLOBAL.lat,
                "long":GLOBAL.long,
                "doctor_condition":'offline',
                "type":type,
                "departments_filter":depart,
                "hospital_filter":hospital,
                "price_range_min":"",
                "price_range_max":"",
                "is_favrouite":"",
                "specialty":speciality,




            }),
        }).then((response) => response.json())
            .then((responseJson) => {

//                alert(JSON.stringify(responseJson))


                if (responseJson.status == true) {
                    this.setState({results:responseJson.doctor_list_s})
                }else{
                    this.setState({results:[]})
                }
            })
            .catch((error) => {
                console.error(error);
                this.hideLoading()
            });


    }

    fetchDepartment = (res,type) => {
        var myarray = [];
        var depart = '';
        if (res == null || res.length == 0) {
            this.fetchSpeciality(res,type,'')
        } else {
            var array = res[0].array
            for (var i = 0; i < array.length; i++) {
                if (array[i].selected == "Y") {
                    depart = depart + array[i].id + ','
                    myarray.push(array[i])

                }
            }
            depart = depart.slice(0, -1);
            //      alert(depart)

            store.get('speciality')
                .then((res) =>
                    //  alert(JSON.stringify(res))
                    this.fetchSpeciality(res,type,depart)
                )
        }
        this.setState({department:myarray})


    }

    getApicall(type)
    {

        store.get('departments')
            .then((res) =>
                //  alert(JSON.stringify(res))
                this.fetchDepartment(res,type)
            )



    }

    setModalVisible=(visible,get)=> {
        this.setState({text:get})
        if (typeof get !== 'undefined') {
            this.getApicall(get)
        }

        this.setState({modalVisible: visible});
    }


    myCallbackFunctions = (res) => {
        this.hideLoading()
        GLOBAL.mobile =  this.state.phone
        if (res.status == 200){
            GLOBAL.which = "2"

            GLOBAL.userID = res.user_id.toString();
            GLOBAL.name = res.name;
            GLOBAL.mobile =  res.mobile;
            AsyncStorage.setItem('mobile', res.mobile);
            AsyncStorage.setItem('userID', res.user_id);
            AsyncStorage.setItem('username', res.name);


            this.props.navigation.navigate('Otp')
        }
        else if (res.status == 201){
            this.setState({visible:true})
        }
        else{
            alert(stringsoflanguages.unable)
        }

    }
    static navigationOptions = ({ navigation }) => {
        return {
            //   header: () => null,
            title: 'CART',
            headerTitleStyle :{textAlign: 'center',alignSelf:'center',color :'black'},
            headerStyle:{
                backgroundColor:'white',
            },
            headerTintColor :'#0592CC',
            animations: {
                setRoot: {
                    waitForRender: false
                }
            }
        }
    }



    showLoading() {
        this.setState({loading: true})
    }


    hideLoading() {
        this.setState({loading: false})
    }



    getCheck =()=>{
        const url =  GLOBAL.BASE_URL  + 'get_check_chat_flag'

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },


            body: JSON.stringify({
                "user_id":GLOBAL.user_id,

            }),
        }).then((response) => response.json())
            .then((responseJson) => {


                if (responseJson.status == true) {


                }else{

                }

                this.getCheck()
            })
            .catch((error) => {
                console.error(error);
                this.hideLoading()
            });
    }
    _handleStateChange = (state) => {


        const url =  GLOBAL.BASE_URL  + 'list_cart'

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },


            body: JSON.stringify({
                "user_id":GLOBAL.user_id,







            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                //          alert(JSON.stringify(responseJson))


                if (responseJson.status == true) {
                    this.setState({results:responseJson.list})
                    this.setState({prices:responseJson.sum_total})
                }else{
                    this.setState({results:[]})
                }
            })
            .catch((error) => {
                console.error(error);
                this.hideLoading()
            });





    }

    componentDidMount(){
        var a = "";

        if (GLOBAL.lab.discount_price  == "0.00"){
            a = GLOBAL.lab.sell_price
        }else{
            a = GLOBAL.lab.discount_price
        }
        this.setState({myprice:a})
        //

        this.props.navigation.addListener('willFocus',this._handleStateChange);

        //   this._handlePressLogin()
    }


    login = () => {
        GLOBAL.price = this.state.prices
        GLOBAL.type = "8"

        this.props.navigation.navigate('LabCartDetail')


    }

    check = () => {
        this.setState({isSecure :!this.state.isSecure})
    }

    selectedFirst = (item,index) => {
        //    alert(JSON.stringify(item))
        var a = this.state.results[index]
        if (a.in_cart == 0){
            a.in_cart = 1
        }else{
            a.in_cart = 0
        }
        this.state.results[index] = a
        this.setState({results:this.state.results})





        var indexs = 0;
        for (var i = 0; i<this.state.results.length; i++){
            if (this.state.results[i].in_cart == 1){
                indexs = indexs + 1;
            }else{

            }
        }
        //    alert(indexs)



        var a = "";

        if (GLOBAL.lab.discount_price  == "0.00"){
            a = GLOBAL.lab.sell_price
        }else{
            a = GLOBAL.lab.discount_price
        }

        var f = parseInt(a) * indexs
        //    alert(f)
        this.setState({myprice:f})

    }
    selectedFirsts = () => {
        var a = this.state.images

        for (var i = 0;i<this.state.images.length ;i ++){

            this.state.images[i].selected = ''
        }

        var index = a[1]
        if (index.selected == ""){
            index.selected = "Y"
        }else{
            index.selected = ""
        }
        this.state.images[1] = index
        this.setState({images:this.state.images})

    }
    getIndex = (index) => {

        this.setState({email:this.state.data[index].id})
    }


    selectedFirstss =  (item) => {
        //   alert(item.cart_id)

        const url =  GLOBAL.BASE_URL  + 'delete_cart'



        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },


            body: JSON.stringify({
                "user_id":GLOBAL.user_id,
                "cart_id":item.cart_id,

            }),
        }).then((response) => response.json())
            .then((responseJson) => {

//                alert(JSON.stringify(responseJson))


                if (responseJson.status == true) {
                    this.setState({results:responseJson.list})
                    this.setState({prices:responseJson.sum_total})
                }else{
                    this.setState({results:[]})

                }
            })
            .catch((error) => {
                console.error(error);
                this.hideLoading()
            });

    }


    _renderItems = ({item,index}) => {



        return (

            <View style={{ flex: 1 ,marginLeft : 5,width:window.width - 10,marginTop: 10,marginBottom:10,borderRadius:10 ,borderBottomColor:'#e1e1e1',borderBottomWidth:1}}>


                <Text  style = {{color:'black',fontSize:22,marginLeft:4,marginTop:4}}>
                    {item.name} ( {item.type} )

                </Text>

                <Text  style = {{color:'#592ccc',fontSize:16,marginLeft:4,marginTop:1}}>
                    {item.test_name}

                </Text>




                <View style = {{marginLeft:5,flexDirection:'row',width:'100%'}}>
                    {item.discount_price == "0.00" && (
                        <Text style={{marginLeft : 5,marginTop:1,fontSize : 18,color :'#FF2D00', height:'auto',fontFamily:'Poppins-Regular',width :'60%',}}>

                            ₹{item.sell_price} /-
                        </Text>
                    )}
                    {item.discount_price != "0.00" && (
                        <Text style={{marginLeft : 5,marginTop:1,fontSize : 18,color :'#FF2D00', height:'auto',fontFamily:'Poppins-Regular',width :'60%',textDecorationLine: 'line-through',}}>

                            ₹{item.sell_price}/-
                        </Text>
                    )}
                    {item.discount_price != "0.00" && (
                        <Text style={{marginLeft : 5,marginTop:1,fontSize : 18,color :'#000000', height:'auto',fontFamily:'Poppins-Regular',width :'50%'}}>

                            ₹{item.discount_price}/-
                        </Text>
                    )}
                    {item.discount_price == "0.00" && (
                        <Text style={{marginLeft : 5,marginTop:1,fontSize : 18,color :'#000000', height:'auto',fontFamily:'Poppins-Regular',width :'50%'}}>


                        </Text>
                    )}
                </View>

                <TouchableOpacity  style = {{
                    position: 'absolute', width: 20, right: 30, height: 20
                }}

                                   onPress={() => this.selectedFirstss(item)
                                   }>
                    <Image style = {{resizeMode: 'contain',height: 20,width:20}}
                           source={require('./closelogo.png')} />
                </TouchableOpacity>


            </View>

        )
    }
    render() {
        //   alert(JSON.stringify(GLOBAL.lab))

        if(this.state.loading){
            return(
                <View style={styles.container}>
                    <ActivityIndicator style = {styles.loading}

                                       size="large" color='#006FA5' />
                </View>
            )
        }

        if(this.state.results.length==0){
            return(
                <View style={styles.container}>
                    <Text style={{marginLeft : '35%',marginTop:'20%',fontSize : 18,color :'black', height:'auto',fontFamily:'Poppins-Regular',width :'60%',}}>
                        Empty cart!
                    </Text>


                </View>
            )
        }
        return (

            <View style={styles.container}>


                <View style={{ marginLeft : 5,width:window.width - 10, backgroundColor: 'white',marginTop: 10,marginBottom:10,borderRadius:10}}>




                    <FlatList style= {{flexGrow:0,margin:8,height:window.height - 100}}
                              data={this.state.results}
                              numColumns={1}
                              keyExtractor = { (item, index) => index.toString() }
                              renderItem={this._renderItems}
                    />



                    <Button style={{fontSize:14,color:'black',fontFamily:'Poppins-Medium'}}
                            containerStyle={{height:30,color:'black',overflow:'hidden',borderTopLeftRadius:4,borderBottomLeftRadius:4,justifyContent:'center',alignSelf:'center'}}
                            onPress={() =>this.props.navigation.navigate('AddMember')}>
                        Add Member
                    </Button>

                </View>
                <View style = {{position:'absolute',bottom:10,flexDirection:'row',width:'100%',backgroundColor:'white',height:50}}>

                    <Text style={{marginLeft : '5%',marginTop:10,fontSize : 18,color :'#FF2D00', height:'auto',fontFamily:'Poppins-Regular',width :'60%',}}>

                        ₹{this.state.prices}/-
                    </Text>

                    <Button
                        style={{padding:4,fontSize: 14,marginTop:10, color: 'white',backgroundColor:'#0592CC',marginLeft:'5%',width:100,height:30,fontFamily:'Poppins-Medium',borderRadius:4}}
                        styleDisabled={{color: 'red'}}
                        onPress={() => this.login()}>
                        CHECKOUT
                    </Button>
                </View>



            </View>

        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
    },
    container: {
        flex:1,

        backgroundColor :'#f1f1f1',

    },
    loading: {
        position: 'absolute',
        left: window.width/2 - 30,

        top: window.height/2,

        opacity: 0.5,

        justifyContent: 'center',
        alignItems: 'center'
    },
    slide1: {

        marginLeft : 50,

        width: window.width - 50,
        height:300,
        resizeMode:'contain',
        marginTop : window.height/2 - 200


    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    transcript: {
        textAlign: 'center',
        color: 'red',

    },
})