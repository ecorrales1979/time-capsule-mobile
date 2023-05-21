import { useEffect, useState } from 'react'
import { Link, useRouter } from 'expo-router'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

import Logo from '../src/assets/spacetime_logo.svg'
import { api } from '../src/lib/api'

interface MemoryDTO {
  id: string
  coverUrl: string
  content: string
  isPublic: boolean
  createdAt: string
}

export default function Memories() {
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()
  const [memories, setMemories] = useState<MemoryDTO[]>([])

  const signOut = async () => {
    await SecureStore.deleteItemAsync('spacetime-token')
    router.push('/')
  }

  const loadMemories = async () => {
    const token = await SecureStore.getItemAsync('spacetime-token')
    const getMemoriesResponse = await api.get<MemoryDTO[]>('/memories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setMemories(getMemoriesResponse.data)
  }

  useEffect(() => {
    loadMemories()
  }, [])

  return (
    <ScrollView
      className="my-4 flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="flex-row items-center justify-between px-8">
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

      <View className="mt-6 space-y-10">
        {memories.map((memory) => (
          <View key={`memory_${memory.id}`} className="space-y-4">
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-50" />
              <Text className="font-body text-xs text-gray-100">
                {dayjs(memory.createdAt)
                  .locale(ptBr)
                  .format('D[ de ]MMMM[, ]YYYY')}
              </Text>
            </View>
            <View className="space-y-4 px-8">
              <Image
                source={{
                  uri: memory.coverUrl,
                }}
                alt=""
                className="aspect-video w-full rounded-lg"
              />
              <Text className="font-body text-base leading-relaxed text-gray-100">
                {memory.content}
              </Text>
              <Link href={`memories/${memory.id}`} asChild>
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="block flex-row items-center gap-1.5"
                >
                  <Text className="font-body text-sm text-gray-200">
                    Ler mais
                  </Text>
                  <Icon name="arrow-right" size={16} color="#9e9ea0" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
