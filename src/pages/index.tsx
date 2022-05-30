import { GetStaticProps } from "next";
import Image from "next/image";
import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

import styles from "./home.module.scss";

//client-side
//server-side
//static site generation

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Início | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>Hey, welcome 👏 </span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton />
        </section>

        <Image
          width="800rem"
          height="800rem"
          src="/images/avatar.svg"
          alt="Girl coding"
        />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const price = await stripe.prices.retrieve(
      "price_1JWfcuHQLm86HHOuW60BdFr3"
    );

    const product = {
      priceId: price.id,
      amount: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price.unit_amount / 100),
    };

    return {
      props: {
        product,
      },
      revalidate: 60 * 60 * 24, //24 hours
    };
  } catch (error) {
    console.log(error);
  }
};
