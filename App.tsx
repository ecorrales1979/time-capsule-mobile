import { ImageBackground, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { styled } from 'nativewind'
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { useFonts, BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import blurBg from './src/assets/bg-blur.png'
import Stripes from './src/assets/stripes.svg'

const StyledStripes = styled(Stripes)

export default function App() {
  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  if (!hasLoadedFonts) return null

  return (
    <ImageBackground
      source={blurBg}
      className="relative flex-1 items-center bg-gray-900"
      // imageStyle={{ position: 'absolute', left: '-200%' }}
    >
      <StyledStripes className="absolute right-2" />
      <Text className="text-5xl font-bold text-gray-50">Hello World!</Text>
      <StatusBar style="light" translucent />
    </ImageBackground>
  )
}
