import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, Form, InputGroup, Button, Alert, Container } from "react-bootstrap";
import priorities from "../priorities";
import isValidUrl from "../isValidUrl";

function EditLink({
  link: { id, url, title, notes, tags, priority, archived, createdAt } = {},
  title: pageTitle = "Edit Link",
  button: buttonText = "Save",
  redirect = true,
}) {
  const router = useRouter();
  const [formDisabled, setFormDisabled] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <Card className="my-4">
      <Container className={`fixed-top md-container mx-auto text-center`}>
        <Alert
          variant="success"
          show={showSuccess}
        >
          <Alert.Heading>Link saved!</Alert.Heading>
        </Alert>
      </Container>
      <Card.Body>
        <Card.Title>{pageTitle}</Card.Title>
        <Form
          disabled={formDisabled}
          onSubmit={async (e) => {
            e.preventDefault();
            if (formDisabled) return;

            const target = e.currentTarget;

            const getItem = (name) => target.elements.namedItem(name);
            const getValue = (name) => getItem(name).value;

            const priority = Array.from(getItem("priority")).filter(
              (x) => x.checked
            )[0];

            const body = {
              url: `${getValue("protocol")}${getValue("url")}`,
              title: getValue("title"),
              notes: getValue("notes"),
              priority: priorities.indexOf(
                priorities.find((x) => x.id === priority.id)
              ),
              id,
              archived: id ? getItem("archived").checked : false,
            };

            const result = await fetch(`/api/links/${id ? "edit" : "create"}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
            const data = await result.json();

            if (redirect)
              router.push(
                `/links#${new Date(data.createdAt).toLocaleDateString()}-${
                  data.id
                }`
              );
            else {
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 2000);
            }
          }}
        >
          <input
            type="hidden"
            name="protocol"
            value={url?.startsWith("https://") ? "https://" : "http://"}
          />
          <Form.Group>
            <Form.Label>URL</Form.Label>
            <InputGroup>
              <Form.Control
                name="url"
                type="text"
                placeholder="https://example.com"
                defaultValue={url
                  ?.replace("http://", "")
                  ?.replace("https://", "")}
                required
                onChange={async (e) => {
                  let url = e.target?.value;
                  const form = e.target.form;
                  const titleTarget = form.title;
                  const protocolTarget = form.protocol;

                  if (!url) {
                    titleTarget.value = "";
                    protocolTarget.value = "http://";
                    return;
                  }

                  if (url.startsWith("http://")) {
                    url = url.replace("http://", "");
                    protocolTarget.value = "http://";
                  } else if (url.startsWith("https://")) {
                    url = url.replace("https://", "");
                    protocolTarget.value = "https://";
                  }
                  form.url.value = url;

                  if (!isValidUrl(url)) return;
                  if (titleTarget.value?.length > 0) return;
                }}
              />
              <Button
                style={{ width: "66px" }}
                variant="danger"
                onClick={(e) => {
                  e.preventDefault();
                  e.target.form.url.value = "";
                  e.target.form.title.value = "";
                  e.target.form.protocol.value = "http://";
                }}
              >
                Clear
              </Button>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <InputGroup>
              <Form.Control name="title" type="text" defaultValue={title} />
              <Button
                style={{ width: "66px" }}
                variant="outline-primary"
                onClick={async (e) => {
                  const form = e.target.form;
                  const titleTarget = form.title;
                  const urlTarget = form.url;
                  const protocolTarget = form.protocol;

                  titleTarget.value = "loading...";
                  titleTarget.disabled = true;
                  setFormDisabled(true);

                  try {
                    const res = await fetch(
                      `/api/fetch-title?url=${protocolTarget.value}${urlTarget.value}`
                    );
                    const data = await res.json();

                    const title = data?.title;

                    if (title.includes("Origin DNS error")) {
                      titleTarget.value = "";
                    } else {
                      titleTarget.value = data.title;
                    }
                    titleTarget.disabled = false;
                    setFormDisabled(false);
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Fetch
              </Button>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Notes</Form.Label>
            <Form.Control
              name="notes"
              as="textarea"
              rows={id ? 5 : 3}
              defaultValue={notes}
            />
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Form.Group>
              <Form.Label>Priority</Form.Label>
              <Form.Group>
                {priorities.map((x) => {
                  return (
                    <Form.Check
                      key={x.id}
                      type="radio"
                      id={x.id}
                      name="priority"
                      label={x.label}
                      defaultChecked={
                        priority || priority === 0
                          ? priorities[priority].id === x.id
                          : x.defaultChecked
                      }
                      inline
                    />
                  );
                })}
                {id && (
                  <Form.Check
                    type="checkbox"
                    id="archived"
                    name="archived"
                    label="Archived"
                    inline
                    defaultChecked={archived}
                  />
                )}
              </Form.Group>
            </Form.Group>

            <div className="align-self-end">
              {!redirect && (
                <Button
                  as={Link}
                  // size="lg"
                  variant="outline-primary"
                  href={`/links#${new Date(
                    createdAt
                  ).toLocaleDateString()}-${id}`}
                >
                  Go back
                </Button>
              )}
              <Button
                variant="primary"
                disabled={formDisabled}
                type="submit"
                // size="lg"
                className="ms-2"
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default EditLink;
