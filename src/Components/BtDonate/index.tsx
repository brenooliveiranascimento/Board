import Link from "next/link"
import styles from './styles.module.scss'

export default function BtnDonate(){
    return(
        <div className={styles.contain}>
         <Link href={'/Donate'} passHref>
          <button>
            Apoiar
          </button>
         </Link>
        </div>
    )
}