import { Link, useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'

import Logo from '../src/assets/spacetime_logo.svg'

export default function Memories() {
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()

  const signOut = async () => {
    await SecureStore.deleteItemAsync('spacetime-token')
    router.push('/')
  }

  return (
    <ScrollView
      className="my-4 flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="flex-row items-center justify-between">
        <Logo />

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={18} color="#000" />
          </TouchableOpacity>

          <Link href="/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={18} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <Text className="text-gray-200">Memorias</Text>
    </ScrollView>
  )
}
