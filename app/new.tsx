import { useState } from 'react'
import {
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Link, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Logo from '../src/assets/spacetime_logo.svg'
import { api } from '../src/lib/api'

export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets()
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    const token = await SecureStore.getItemAsync('spacetime-token')
    let coverUrl = ''

    if (preview) {
      const uploadFormData = new FormData()
      uploadFormData.append('media', {
        name: 'image.jpg',
        type: 'image/jpeg',
        uri: preview,
      } as any)

      const uploadResponse = await api.post<{ fileUrl: string }>(
        '/upload',
        uploadFormData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      coverUrl = uploadResponse.data.fileUrl

      const createMemoryResponse = await api.post(
        '/memories',
        { coverUrl, isPublic, content },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (
        createMemoryResponse.status < 200 ||
        createMemoryResponse.status >= 300
      ) {
        throw new Error('Erro no cadastro da memória')
      }

      router.push('/memories')
    }
  }

  const openImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })

      if (result.assets[0].uri) {
        setPreview(result.assets[0].uri)
      }
    } catch (error) {}
  }

  return (
    <ScrollView
      className="my-4 flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="flex-row items-center justify-between">
        <Logo />

        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
            trackColor={{
              false: '#767577',
              true: '#372560',
            }}
          />
          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openImagePicker}
          className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
        >
          {preview ? (
            <Image
              source={{ uri: preview }}
              className="h-full w-full rounded-lg object-cover"
              alt=""
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#fff" />
              <Text className="font-body text-sm text-gray-200">
                Adicione foto ou vídeo da capa
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          multiline
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
          className="p-0 font-body text-lg text-gray-50"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência"
          placeholderTextColor="#56565a"
        />

        <TouchableOpacity
          activeOpacity={0.7}
          className="mt-10 block items-center self-end rounded-full bg-green-500 px-6 py-2"
          onPress={handleSubmit}
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
