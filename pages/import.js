import { useState } from "react";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";

import { Container, Button, Form } from "react-bootstrap";
import Navbar from "../lib/components/Navbar";
import Footer from "../lib/components/Footer";
import isValidUrl from "../lib/isValidUrl";

export default function Component() {
  const [body, setBody] = useState([]);
  const [formDisabled, setFormDisabled] = useState(false);

  const { data: session, status } = useSession();
  const loading = status === "loading";

  const router = useRouter();

  if (!loading && !session) signIn();

  if (loading) return <>loading...</>;
  if (!session) return <>signing in...</>;

  return (
    <Container className="md-container">
      <Navbar />
      <h1>Import links</h1>
      <Form className="d-flex flex-column">
        <Form.Control
          name="notes"
          as="textarea"
          rows={15}
          disabled={formDisabled}
          placeholder="Paste your links here"
          onInput={(e) => {
            const lines = e.target.value.split("\n");

            // parse links to object - if previous line is a link, add it to the current link
            const links = lines
              .reduce((acc, line, i) => {
                if (line.length === 0) return [...acc, []];

                if (acc[acc.length - 1]?.length > 0) {
                  acc[acc.length - 1].push(line);
                } else {
                  acc.push([line]);
                }

                return acc;
              }, [])
              .filter((link) => link.length > 0);

            const linksObj = links
              .map((link) => {
                const title = link[0];
                const isUrl = isValidUrl(title);

                let object = null;
                if (!isUrl) {
                  if (link.length === 1) return null;

                  object = {
                    title,
                    url: [...link.slice(1)],
                  };
                } else {
                  object = {
                    title: null,
                    url: [...link],
                  };
                }

                object.url = object.url.map((x) =>
                  (x.startsWith("http") ? x : `http://${x}`).trim()
                );

                if (object.url.length === 1) object.url = object.url[0];
                else {
                  object.notes = object.url.join("\n");
                  object.url = object.url[0];
                }

                return object;
              })
              .filter((x) => x);

            setBody(linksObj);
          }}
        />
        <Button
          className="mx-auto mt-3"
          variant="primary"
          disabled={formDisabled}
          onClick={async (e) => {
            e.preventDefault();
            setFormDisabled(true);
            
            await fetch("/api/links/create-bulk", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ body }),
            });

            router.push("/links");
          }}
        >
          Submit
        </Button>
      </Form>
      <Footer />
    </Container>
  );
}
