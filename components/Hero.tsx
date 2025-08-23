// components/Hero.tsx
import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <h1 className={styles.title}>
          Driven<br />
          by<br />
          Innovation
        </h1>
        <p className={styles.lead}>
          楽しく、速く、結果にコミットする IT パートナー。
        </p>
      </div>

      <div className={styles.visualWrap} aria-hidden>
        <Image
          src="/logo.png"
          alt="Main Visual"
          fill
          priority
          className={styles.visual}
          sizes="(min-width:1280px) 45vw, (min-width:768px) 50vw, 90vw"
        />
      </div>
    </section>
  );
}
