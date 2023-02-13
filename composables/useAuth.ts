import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from 'firebase/auth'

export const useAuth = () => {
  const token = useState<any>('token', () => null)
  const userMail = useState<any>('userMail', () => null)
  const router = useRouter()
  const config = useRuntimeConfig()

  const signIn = async (email: string, password: string) => {
    return await new Promise<void>((resolve, reject) => {
      const auth = getAuth()
      return signInWithEmailAndPassword(auth, email, password).then((response) => {
        response.user.getIdToken().then((idToken) => {
          token.value = idToken
          userMail.value = email
          localStorage.removeItem('userName')
          router.push({ path: '/' })
          resolve()
        }).catch(reject)
      })
    })
  }

  const signOut = async () => {
    return await new Promise<void>((resolve, reject) => {
      const auth = getAuth()
      firebaseSignOut(auth).then(() => {
        token.value = null
        router.push({ path: '/login' })
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  }

  const signUp = async (email: string, password: string, name: string) => {
    return await new Promise<void>((resolve, reject) => {
      const auth = getAuth()
      createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        alert('登録いたしました。\nログイン画面からログインしてください。')
        useAsyncData(
          'mountains',
          () => $fetch(config.MEMBERS_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-MICROCMS-API-KEY': config.MICROCMS_KEY
            },
            body: {
              'user-name': name,
              'user-mail': email
            }
          })
        )
        router.push({ path: '/login' })
        resolve()
      }).catch((error) => {
        alert('登録に失敗しました。')
        reject(error)
      })
    })
  }

  const checkAuthState = async () => {
    return await new Promise<void>((resolve, reject) => {
      if (process.server) return resolve()
      const auth = getAuth()
      onAuthStateChanged(auth, (user) => {
        if (user) {
          user.getIdToken().then((idtoken) => {
            token.value = idtoken
            resolve()
          }).catch(reject)
        } else {
          token.value = null
          resolve()
        }
      }, (error) => {
        reject(error)
      })
    })
  }

  const getLoginUser = getAuth()

  return {
    signIn,
    signOut,
    signUp,
    userMail,
    token,
    getLoginUser,
    checkAuthState
  }
}