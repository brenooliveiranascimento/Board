import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import firebase from '../../../services/firebaseConection'


export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope:'read:user'
    }),
    // ...add more providers here
  ],
  callbacks:{ 
    async session(session, profile){
      try{

        const lastDonate = await firebase.firestore().collection('users').doc(String(profile.sub)).get()
        .then((snapsot)=>{
          if(snapsot.exists){
            return snapsot.data().create.toDate();
          }else{
            return false
          }
        })
        
        return{
          ...session,
          id:profile.sub,
          vip:lastDonate ? true : false,
          lastDonate: lastDonate
        }
      }
        catch{
          return{
            ...session,
            id:null,
            vip:false,
            lastDonate:null
          }
        }
    },
    async signIn(user, account, profile){
      const { email } = user;
      try{
        return true
      }catch(err){
        console.log('deu erro' + err)
        return false
      }
    }

  }

})