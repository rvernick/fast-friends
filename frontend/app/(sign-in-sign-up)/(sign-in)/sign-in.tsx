import { Surface } from 'react-native-paper'
import { LoginComponent } from '@/components/account/LoginComponent';
import { Dimensions } from 'react-native';
import { isMobile } from '@/common/utils';
import { createStyles, styles } from '@/common/styles';


export default function SignIn() {

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : styles


  return (
    <Surface style={useStyle.container}>
      <LoginComponent/>
    </Surface>
  );
}
