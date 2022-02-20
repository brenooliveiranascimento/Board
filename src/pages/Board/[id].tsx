import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client";
import Head from "next/head";
import { FaCalendar } from "react-icons/fa";
import firebase from '../../services/firebaseConection'
import styles from './styles.module.scss'

type Task = {
    name:string,
    id:string,
    uid:string,
    create:string | Date,
    createdFormated: string,
    tarefa:string
}


interface TaskListProps{
        data:string
}

export default function Id({ data }: TaskListProps){

    const tasks = JSON.parse(data) as Task
    
    return(
        <>
        <Head>
            <title>
                Board - detalhes
            </title>
        </Head>
        <main className={styles.container}>
            <div className={styles.criado} >
                <span >
                    <FaCalendar color="#ffb600" size={20}/>
                    Tarefa criada em: 
                </span>
                <span className={styles.date}>
                    { tasks.createdFormated }
                </span>
                <p>
                    { tasks.tarefa }
                </p>
            </div>
        </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params })=>{
    
    
    const { id } = params
    const session = await getSession({ req });
    console.log(session.vip)

    if(!session?.vip){
        return{
            redirect:{
                destination:"/Board",
                permanent:false
            }
        }
    }

    const data = await firebase.firestore().collection('tarefas').doc(String(id))
    .get().then((snapshot)=>{
        const data = {
            id:snapshot.id,
            name:snapshot.data().name,
            uid:snapshot.data().uid,
            tarefa:snapshot.data().tarefa,
            create:snapshot.data().create,
            createdFormated:snapshot.data().createdFormated,
        }

        return(JSON.stringify(data))
    }).catch(()=>{
        return {}
    })

    if(Object.keys(data).length === 0){
        return{
            redirect:{
                destination:"/Board",
                permanent:false
            }
        }
    }

    return{
        props:{
            data
        }
    }
}