import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Form, Button, Row, Col } from "react-bootstrap";
import MainNav from "../components/MainNav";
import { useEffect, useState } from "react";

import { useAtom } from "jotai";
import { searchHistroyAtom } from "../store";
import { addToHistory } from "../lib/userData";


export default function AdvancedSearch(props) {
  const router = useRouter();
  const { searchHistory, setSearchHistory } = useAtom(searchHistroyAtom);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      searchBy: "title",
      geoLocation: "",
      medium: "",
      isOnView: "true",
      isHighlight: "false",
      q: "",
    },
  });
  useEffect(() => {
    let data = {
      searchBy: "title",
      geoLocation: "",
      medium: "",
      isOnView: "true",
      isHighlight: "false",
      q: "",
    };
    for (const prop in data) {
      setValue(prop, data[prop]);
    }
  }, []);
  async function submitForm(data) {
    let queryString = "";
    queryString += `searchBy=${data.searchBy}`;
    if (data.geoLocation) {
      queryString += `&geoLocation=${data.geoLocation}`;
    }
    if (data.medium) {
      queryString += `&medium=${data.medium}`;
    }
    queryString += `&isOnView=${data.isOnView}`;
    queryString += `&isHighlight=${data.isHighlight}`;
    queryString += `&q=${data.q}`;

    setSearchHistory(await addToHistory(queryString));
    router.push(`/artwork?${queryString}`);
  }

  return (
    <>
      <MainNav />
      <h1>Advanced Search</h1>
      <Form onSubmit={handleSubmit(submitForm)}>
        <Col>
          <Form.Group as={Row} className="mb-3" controlId="searchBy">
            <Form.Label column sm={2}>
              Search By
            </Form.Label>
            <Col sm={10}>
              <Form.Select {...register("searchBy")}>
                <option value="title">Title</option>
                <option value="tags">Tags</option>
                <option value="artistOrCulture">Artist/Culture</option>
              </Form.Select>
            </Col>
            <Col sm={10}>
              <Form.Group className="mb-3" controlId="geoLocation">
                <Form.Label>Geo Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Geo Location"
                  {...register("geoLocation")}
                />
                <Form.Text className="text-muted">
                  Case Sensitive String (ie &quot;Europe&quot;,
                  &quot;France&quot;, &quot;Paris&quot;, &quot;China&quot;,
                  &quot;New York&quot;, etc.), with multiple values separated by
                  the | operator
                </Form.Text>
              </Form.Group>
            </Col>
            <Col sm={10}>
              <Form.Group className="mb-3" controlId="medium">
                <Form.Label>Medium</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Medium"
                  {...register("medium")}
                />
                <Form.Text className="text-muted">
                  Case Sensitive String (ie &quot;Oil on Canvas&quot;,
                  &quot;Bronze&quot;, &quot;Wood&quot;, &quot;Stone&quot;,
                  &quot;Paper&quot;, etc.), with multiple values separated by
                  the | operator
                </Form.Text>
              </Form.Group>
            </Col>
            <Col>
              <Form.Check
                type="checkbox"
                label="On View"
                {...register("isOnView")}
              />
              <Form.Check
                type="checkbox"
                label="Highlight"
                {...register("isHighlight")}
              />
            </Col>
            <br />
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form.Group>
        </Col>
      </Form>
    </>
  );
}
