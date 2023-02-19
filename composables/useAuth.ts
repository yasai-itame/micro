import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser
} from 'firebase/auth'

export const useAuth = () => {
  const token = useState<any>('token', () => null)
  const router = useRouter()
  const config = useRuntimeConfig()

  const signIn = async (email: string, password: string) => {
    return await new Promise<void>((resolve, reject) => {
      const auth = getAuth()
      return signInWithEmailAndPassword(auth, email, password).then((response) => {
        response.user.getIdToken().then((idToken) => {
          token.value = idToken
          localStorage.setItem('userMail', email)
          router.push({ path: '/' })
          resolve()
        }).catch((error) => {
          reject(error)
        })
      }).catch((error) => {
        alert('入力情報に誤りがあります。')
        console.log(error)
      })
    })
  }

  const signOut = async () => {
    return await new Promise<void>((resolve, reject) => {
      const auth = getAuth()
      firebaseSignOut(auth).then(() => {
        token.value = null
        localStorage.removeItem('userMail')
        localStorage.removeItem('userName')
        router.push({ path: '/login' })
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (!name || !email || !password) {
      alert('全て入力必須となります。')
      return false
    }
    return await new Promise<void>((resolve, reject) => {
      const auth = getAuth()
      const user = auth.currentUser
      let now = new Date()
      createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        updateProfile(user, {
          displayName: name
        })
        useAsyncData(
          String(now.getTime()),
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
        alert('登録いたしました。\nログイン画面からログインしてください。')
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

  const callFireBaseUser = async (name: string, email: string, oldPassword: string, newPassword: string, microId: string) => {
    if (!name || !email || !oldPassword) {
      alert('全て入力必須となります。')
      return false
    }
    let check = confirm('この内容で登録します。\nよろしいでしょうか。')
    if (check) {
      return await new Promise<void>((resolve, reject) => {
        const auth = getAuth()
        const user = auth.currentUser
        const credential = EmailAuthProvider.credential(
          user?.email ?? '',
          oldPassword
        )
        reauthenticateWithCredential(user, credential).then(() => {
          updateProfile(user, {
            displayName: name
          })
          updateEmail(user, email).then().catch((error) => {
            reject(error)
          })
          updatePassword(user, newPassword).then(() => {
            let now = new Date()
            useAsyncData(
              String(now.getTime()),
              () => $fetch(`${config.MEMBERS_URL}/${microId}`, {
                method: 'PATCH',
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
            alert('ユーザー情報を更新いたしました。\nログインをしてください。')
            router.push({ path: '/login' })
          }).catch((error) => {
            reject(error)
          })
          resolve()
        }).catch((error) => {
          alert('入力情報に誤りがあります。')
          console.log(error)
          reject(error)
        })
      })
    }
  }

  return {
    signIn,
    signOut,
    signUp,
    // userMail,
    token,
    checkAuthState,
    callFireBaseUser
  }
}