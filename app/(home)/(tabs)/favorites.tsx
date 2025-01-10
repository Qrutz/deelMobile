import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { View } from "react-native";

export default function App() {
    const [val, setVal] = useState('java');
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Picker
                selectedValue={val}
                onValueChange={setVal}
                style={{ width: 200, alignSelf: 'center', color: 'black', backgroundColor: 'white' }}
                itemStyle={{ color: 'black' }}
            >
                <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" />
            </Picker>
        </View>
    );
}
