import { createStackNavigator } from "@react-navigation/stack";
import {NavigationContainer} from '@react-navigation/native';
import Login from "./screens/login";

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
                {/* <Stack.Screen name="AddLivroScreen" component={AddLivro} />
                <Stack.Screen name="ViewLivroScreen" component={ViewLivro} /> */}

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;