
import { useState, FormEvent } from 'react'
import firebase from '../../services/firebaseConection'
import Head from 'next/head'
import styles from './styles.module.scss'
import { FaClock, FaPlus, FaTrash } from 'react-icons/fa'
import { FiCalendar, FiClock, FiEdit2, FiPlus, FiX } from 'react-icons/fi'
import BtnDonate from '../../Components/BtDonate'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import { redirect } from 'next/dist/server/api-utils'
import { format, formatDistance } from 'date-fns'
import { ptBR} from 'date-fns/locale'
import Link from 'next/link'

type TaskList = {
    id:string,
    create:string | Date,
    tarefa:string,
    uid:string,
    name:string,
    createdFormated:string
}

interface BoardProps{
    user:{
        name:string,
        id:string,
        vip:boolean,
        lastDonate:string | Date
    },
    data:string
}


export default function Board({ user, data }: BoardProps){

    const [input, setInput] = useState('');
    const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data));
    const [editTask, setEditTask] = useState<TaskList | null>(null)

    async function handleTask(e : FormEvent){
        e.preventDefault()

        if(editTask){

        firebase.firestore().collection('tarefas').doc(editTask.id).update({
            tarefa:input
        })
        .then(()=>{
            let data = taskList;
            let taskIndex = taskList.findIndex( item =>(item.id === editTask.id )  )
            data[taskIndex].tarefa = input;
            setEditTask(null)
            setInput('')
            })
            
            return
        }

        firebase.firestore().collection('tarefas').add({
            name:user.name,
            uid:user.id,
            tarefa:input,
            create: new Date(),
            createdFormated: format( new Date(), 'dd MMMM yyyy'),
        }).then((value)=>{
            let data = {
                id:value.id,
                name:user.name,
                uid:user.id,
                create:new Date(),
                createdFormated: format( new Date(), 'dd MMMM yyyy'),
                tarefa:input
            }

            setInput('')
            setTaskList([...taskList, data])
        })
    }

    async function handleDelete(id: string){
        await firebase.firestore().collection('tarefas').doc(id).delete()
        .then(()=>{
            let taskdelet = taskList.filter( item =>{
                return( item.id !== id )
            } )
            setTaskList(taskdelet)
        })
    }

     async function handleEdit(task: TaskList){
        setInput(task.tarefa);
        setEditTask(task);
     }

     function handleCancelEdit(){
         setInput('');
         setEditTask(null);
     }

    return(
        <>
        <Head>
            <title>Board-Tarefas</title>
        </Head>
        
        <main className={styles.container}>
        { editTask && (
                    
                    <span className={styles.edit}>
                        <button
                        onClick={handleCancelEdit}
                        >
                        <FiX size={20} color="#ff3636"/>
                    </button>você está editando uma tarefa</span>
                ) }
            <form onSubmit={handleTask}>
                
                <input
                onChange={(e)=>setInput(e.target.value)}
                value={input}
                type={'text'}
                placeholder="Digite sua tarefa"
                />
                <button type='submit'>
                    <FiPlus color='#17181f' size={25}/>
                </button>
            </form>
            <h1>voce tem { taskList.length } { taskList.length === 1 ? 'tarefa!' : 'tarefas!' }</h1>

            <section>
                {
                    taskList.map( i =>(
                        <article key={i.id} className={styles.taskList}>
                            <Link href={`/Board/${i.id}`} passHref>
                                <p>{ i.tarefa }</p>
                            </Link>
                        <div className={styles.actions}>
                            <div>
                                <div>
                                    <FiCalendar color='#ffb600' size={20}/>
                                    <data>{ i.createdFormated } </data>
                                </div>
                                { user.vip && (
                                    <button
                                    onClick={ () => handleEdit(i) }
                                    >
                                        <FiEdit2 color='#fff'/>
                                        <span>editar</span>
                                    </button>
                                )}
                                
                                </div>
                                <button
                                onClick={()=>handleDelete(i.id)}
                                >
                                    <span>excluir</span>
                                    <FaTrash color="#ff3636"/>
                                </button>
                            </div>
                        </article>
                    ) )
                }
               
            </section>
        </main>

     {
         user.vip && (
            <div className={styles.vipArea}>
                <h3>Obrigado por apoiar o projeto!!</h3>
                <div>
                    <FiClock color='#fff' size={25}/>
                    <data>
                        sua ultima doação foi há { formatDistance( new Date(user.lastDonate), new Date(), { locale:ptBR } ) }
                    </data>
                </div>
            </div>
         )
     }
        
            <BtnDonate/>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req})=>{
    const session = await getSession({ req })

    if(!session?.id){
        return{
            redirect:{
                destination:'/',
                permanent:false
            }
        }
    }

    const tasks = await firebase.firestore().collection('tarefas').where('uid', '==', session?.id).orderBy('create', 'asc').get()

    const data = JSON.stringify(tasks.docs.map( u =>{
        return{
            id:u.id,
            ...u.data()
        }
    } ))

    console.log(data)

    const user = {
        name: session?.user.name,
        id: session?.id,
        vip:session?.vip,
        lastDonate:session?.lastDonate
    }

    return{
        props:{
            user,
            data
        }
    }
}