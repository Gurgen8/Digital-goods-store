import Icon from "../Icon/Icon"
import styles from "./Footer.module.css"


export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* Nav links */}
        <nav className={styles.nav} aria-label="Навигация футера">
          <a href="#" className={styles.navLink}>Стать продавцом</a>
          <a href="#" className={styles.navLink}>Бонусы</a>
          <a href="#" className={styles.navLink}>Поддержка</a>
          <a href="#" className={styles.navLink}>Гарантии</a>
          <a href="#" className={styles.navLink}>Отзывы</a>
        </nav>

        <div className={styles.divider} />

        {/* Social + Payment row */}
        <div className={styles.middleRow}>
          <div className={styles.socials}>
            <a href="#" className={styles.socialLink} aria-label="ВКонтакте"><Icon name="vk" /></a>
            <a href="#" className={styles.socialLink} aria-label="Telegram"><Icon name="telegram" /></a>
            <a href="#" className={styles.socialLink} aria-label="TikTok"><Icon name="tiktok" /></a>
            <a href="#" className={styles.socialLink} aria-label="YouTube"><Icon name="youtube" /></a>
          </div>

          <div className={styles.payments}>
            <div className={styles.paymentBadge}><Icon name="visa" /></div>
            <div className={styles.paymentBadge}><Icon name="mir" /></div>
            <div className={styles.paymentBadge}><Icon name="mastercard" /></div>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Legal links */}
        <div className={styles.legal}>
          <a href="#" className={styles.legalLink}>Политика конфиденциальности</a>
          <a href="#" className={styles.legalLink}>Соглашение</a>
          <a href="#" className={styles.legalLink}>Договор-оферта</a>
        </div>

      </div>
    </footer>
  )
}
