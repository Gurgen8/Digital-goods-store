import { Link } from "react-router-dom"
import Container from "../../components/Container/Container"
import Footer from "../../components/Footer/Footer"
import Header from "../../components/Header/Header"
import styles from "./NotFoundPage.module.css"

export default function NotFoundPage() {
  return (
    <div>
      <Header />
      <Container>
        <div className={styles.wrap}>
          <h1 className={styles.title}>404</h1>
          <p className={styles.text}>Not found</p>
          <Link to="/">Back to home</Link>
        </div>
      </Container>
      <Footer />
    </div>
  )
}
