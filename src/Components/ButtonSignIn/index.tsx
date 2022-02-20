import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import styles from './styles.module.scss'
import { useSession, signIn, signOut } from 'next-auth/client'
import Image from 'next/image'

export function ButtonSignIn(){

    const [session] = useSession()
    console.log(session)

    return session ? (
        <button
        onClick={()=>signOut()}
        type='button'
        className={styles.ButtonContain}
        >
            <Image  height={45} width={45} src={session.user.image} alt='user image'/>
                <p>Seja bem vindo { session.user.name }</p>
            <FiX
            className={styles.svgImage}
            color='#ddd'
            />
        </button>
       
    ) : (
        <button
        onClick={()=>signIn('github')}
        type='button'
        className={styles.ButtonContain}
        >
            <FaGithub
            color='#ffb800'
            />
            entrar com o gitHub
        </button>
    );
}