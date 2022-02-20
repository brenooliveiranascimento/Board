import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Head from "next/head";
import styles from './styles.module.scss'
//client id = AUgWmEfZVwpBxGRlPFacIWUprVpEp-_hNmSSTjJMfGoe3-9IaJRnRDoMKpnF6mqGW0XpJ8h4K4HzzxVr
//<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>
import { PayPalButtons } from '@paypal/react-paypal-js'
import firebase from '../../services/firebaseConection'
import { useState } from "react";
import Image from "next/image";
import rocket from '../../../Public/images/rocket.svg'

interface userType{
    user:{
        name:string,
        id:string,
        image:string,
        vip:boolean
    }
}

export default function Donate({ user }: userType ){
    const [showVip, setShowVip] = useState(false);


    async function handleDonate(){
        await firebase.firestore().collection('users').doc(user.id).set({
            donate:true,
            image:user.image,
            create:new Date()
        }).then(()=>{
            setShowVip(true)
        })
    }

return(
    <>
     <Head>
        <title>Board - donate</title>    
     </Head>

     <main className={styles.container}>
        <Image src={rocket} alt="Seja apoiador"/>

        {
            showVip && (
                <div className={styles.vip}>
                    <Image width={50} height={50} src={user.image} alt="seja apoiador"/>
                    <span>parabéns! Agora voçe é um apoiador!!</span>
                </div>
            )
        }

        {
            user.vip && (
                <div className={styles.vip}>
                    <Image width={50} height={50} src={user.image} alt="seja apoiador"/>
                    <span>parabéns! Agora voçe é um apoiador!!</span>
                </div>
            )
        }

        

        <h1>Seja um Apoiador do Projeto! 🏆 </h1>
        <h3>contribua com apenas <span>1,00R$</span></h3>
        <strong>Apareca na nossa home! Tenha funcionalidades exclusivas!</strong>

        <PayPalButtons
        createOrder={(data, actions)=>{
            return actions.order.create({
                purchase_units:[{
                    amount:{
                        value:'1'
                    }
                }]
            })
        }}
        onApprove={(data, actions)=>{
            return actions.order.capture().then((datails)=>{
                console.log('foi')
                handleDonate()
            })
        }}
        />

     </main>
    </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) =>{

    const session = await getSession({ req })

    if(!session?.id){
        return{
            redirect:{
                destination:'/',
                permanent:false
            }
        }
    }

    const user = {
        name:session?.user.name,
        image:session?.user.image,
        id:session.id,
        vip:session?.vip
    }

    return{
        props:{
            user
        }
    }
}