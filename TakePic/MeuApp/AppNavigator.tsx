import { createStackNavigator } from "@react-navigation/stack";
import {NavigationContainer} from '@react-navigation/native';
import Login from "./screens/login";
import Cadastro from "./screens/cadastro";
import MinhaConta from "./screens/minhaConta";

const Stack = createStackNavigator();

function AppNavigator(){
    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginScreen">

                <Stack.Screen options={{
                    title: "",
                    headerTransparent: true,
                    headerShown: false,
                }} name="LoginScreen" component={Login} />

                <Stack.Screen options={{
                    title: "",
                    headerTransparent: true,
                    headerShown: false,
                }} name="CadastroScreen" component={Cadastro} />

                <Stack.Screen options={{
                    title: "",
                    headerTransparent: true,
                    headerShown: false,
                }} name="MinhaContaScreen" component={MinhaConta} />
                

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;