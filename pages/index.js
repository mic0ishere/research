import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

import LinkModel from "../lib/linkModel";
import dbConnect from "../lib/dbConnect";

import { Container, Button } from "react-bootstrap";
import Link from "next/link";
import Navbar from "../lib/components/Navbar";
import EditLink from "../lib/components/EditLink";
import Footer from "../lib/components/Footer";

export default function Component({ linksCount }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const router = useRouter();

  if (!loading && !session) signIn();

  if (loading) return <>loading...</>;
  if (!session) return <>signing in...</>;

  return (
    <Container className="md-container">
      <Navbar />
      <EditLink title="New link" button="Create a link" link={{}} />
      {linksCount > 0 && (
        <Container className="my-4 mx-auto text-center">
          <h1>Wanna see other links?</h1>
          <p>
            Check other {linksCount} links you have saved by going to{" "}
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
      )}
      <Footer />
    </Container>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      props: {},
    };
  }

  await dbConnect();
  const links = await LinkModel.find({});

  return {
    props: {
      linksCount: links.length ?? 0,
    },
  };
}
