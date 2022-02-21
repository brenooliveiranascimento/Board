import styles from './styles.module.scss'
import Link from 'next/link'
import { ButtonSignIn } from '../ButtonSignIn'
import Image from 'next/image'
import headerLogo from '../../../Public/images/logo.svg'



export default function Header(){


    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContain}>
                <Link href="/" passHref>
                  <Image src={headerLogo} alt="board" />
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