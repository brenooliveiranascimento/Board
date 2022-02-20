import styles from '../../styles/styles.module.scss'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import firebase from '../services/firebaseConection'
import { useState } from 'react'
import Image from 'next/image'
import boardUser from '../../Public/images/board-user.svg'

type Data = {
    id:string,
    donade:boolean,
    create:string,
    image:string
}

interface HomeProp{
  data:string
}

export default function Home({ data } : HomeProp) {

  const [ donaters, setDonaters ] = useState<Data[]>(JSON.parse(data))

  return (
    <>
    <Head>
      <title>Board - Organize suas tarefas</title>
    </Head>
  <main className={styles.MainContain}>
      <div className={styles.homeImage}>
        <Image alt='logo' src={boardUser}/>
      </div>

      <section className={styles.sectionContain}>
        <h1>
          Uma ferramenta para o seu dia a dia escreva, planeje e organize-se
        </h1>

        <p>
          <span>100% gratuito</span> e online
        </p>


      </section>

      {donaters.length >= 1 && <h3 className={styles.apoiadores}>Apoiadores</h3>}



    <div
    className={styles.apoiadoresContain}
    >
      {
        donaters.map((item)=>(
          <Image alt='board' key={item.id} width={65} height={65} src={item.image}/>
          ) )
      }
    </div>

  </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ()=>{

  const donaters = await firebase.firestore().collection('users').get()

  const data = JSON.stringify(donaters.docs.map( item =>{
    return{
      id:item.id,
      ...item.data(),
    }
  } ))

  return{
    props:{
      data
    },
    revalidate: 60 * 60
  }
}