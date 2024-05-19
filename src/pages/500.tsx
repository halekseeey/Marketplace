import {GetStaticProps} from 'next';


export default function Error505() {
    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>
            <h1>Упс... что-то пошло не так:(</h1>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return {
        props: {
            cookies: {
                app_theme: 'dark'
            }
        }
    }
}