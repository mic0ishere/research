import { useRouter } from "next/router";
import priorities from "../priorities";

import { Badge, Card, Dropdown } from "react-bootstrap";
import Link from "next/link";
import Edit from "./icons/Edit";
import Archive from "./icons/Archive";
import Delete from "./icons/Delete";

function LinkView({ link, date, revalidate }) {
  const router = useRouter();

  return (
    <Card key={link.id} id={link.id} data-date={date} className="link mb-3">
      <Card.Body>
        <Dropdown className="float-end" align="end">
          <Dropdown.Toggle
            variant="link"
            id="dropdown-basic"
            className="text-decoration-none text-muted"
          ></Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={async () => {
                await fetch(`/api/links/archive?id=${link.id}`, {
                  method: "POST",
                });
                revalidate();
              }}
              className="d-flex align-items-center"
              as="button"
            >
              <Archive /> {link.archived ? "Unarchive" : "Archive"}
            </Dropdown.Item>
            <Dropdown.Item
              as={Link}
              href={`/edit/${link.id}`}
              className="d-flex align-items-center"
            >
              <Edit /> Edit
            </Dropdown.Item>
            <Dropdown.Item
              onClick={async () => {
                await fetch(`/api/links/remove?id=${link.id}`, {
                  method: "DELETE",
                });
                revalidate();
              }}
              className="text-danger d-flex align-items-center"
              as="button"
            >
              <Delete />
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Card.Title>
          <Link href={link.url} target="_blank" rel="nofollow noreferrer">
            {link.title}
          </Link>
          <br />
          <small className="text-muted fs-6 fw-normal">
            {link.url.replace("http://", "").replace("https://", "")}
          </small>
        </Card.Title>
        <Card.Text
          style={{ whiteSpace: "pre-line" }}
          onClick={(e) => {
            if (e.target.tagName === "A") return;
            // prevent the card from being clicked when the user is selecting text
            if (window.getSelection().toString()) return;

            router.push(`/edit/${link.id}`);
          }}
        >
          {link.notes}
        </Card.Text>

        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <Badge bg={priorities[link.priority].background}>
              {priorities[link.priority].label}
            </Badge>
            <small className="ms-2 text-muted">
              {link.archived && "Archived"}
            </small>
          </div>
          <small className="text-muted">
            {new Date(link.createdAt).toLocaleString([], {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
}

export default LinkView;
