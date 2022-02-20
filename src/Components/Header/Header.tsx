import styles from './styles.module.scss'
import Link from 'next/link'
import { ButtonSignIn } from '../ButtonSignIn/'
import Image from 'next/image'
import headerLogo from '../../../public/images/logo.svg'



export function Header(){


    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContain}>
                <Link href="/" passHref>
                 <a>
                  <Image src={headerLogo} alt="board" />
                 </a>
                </Link>

                <nav>
                    <Link href="/" passHref>
                        <a>Home</a>
                    </Link>

                    <Link href="/Board" passHref>
                        <a>Board</a>
                    </Link>

                </nav>

                <ButtonSignIn/>
            </div>
        </header>
    )
}