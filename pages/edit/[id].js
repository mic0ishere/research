import { useSession, signIn } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useRouter } from "next/router";
import { Container, Button } from "react-bootstrap";
import Link from "next/link";
import Navbar from "../../lib/components/Navbar";
import EditLink from "../../lib/components/EditLink";
import Footer from "../../lib/components/Footer";

import LinkModel from "../../lib/linkModel";
import dbConnect from "../../lib/dbConnect";

export default function Component({ link: data }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const router = useRouter();
  const link = JSON.parse(data);

  if (!loading && !session) signIn();

  if (loading) return <>loading...</>;
  if (!session) return <>signing in...</>;

  return (
    <Container className="md-container">
      <Navbar />
      <EditLink link={link} redirect={false} />
      <Container className="my-4 mx-auto text-center">
        <h1>Changed you mind?</h1>
        <p>
          Check other links you have saved by going to{" "}
          <Link className="link-primary" href="/links">
            /links
          </Link>
        </p>
        <Button
          variant="primary"
          onClick={() => {
            router.push("/links");
          }}
        >
          Browse links
        </Button>
      </Container>
      <Footer />
    </Container>
  );
}

export async function getServerSideProps({ req, res, params: { id } }) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  await dbConnect();
  const data = await LinkModel.findOne({ id });

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      link: JSON.stringify(data),
    },
  };
}
