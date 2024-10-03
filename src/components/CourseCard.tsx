import { StarBorder, Star } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  Divider,
  CardActions,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Course } from "../App";

export default function CourseCard({
  course,
  isFavourite,
  toggleFav,
}: {
  course: Course;
  isFavourite: boolean;
  toggleFav: () => void;
}) {
  return (
    <Card key={course.id} sx={{ display: "flex", flexDirection: "column" }}>
      {/* <CardActionArea
          LinkComponent={(props) => (
            <Link to={`/course/${course.id}`} {...props} />
          )}
          href={`/course/${course.id}`}
          sx={{ height: "100%" }}
        > */}
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h5" component="div">
          {course.title}{" "}
          <Checkbox
            checked={isFavourite}
            onChange={() => toggleFav()}
            icon={<StarBorder />}
            checkedIcon={<Star />}
            size="small"
          />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {course.subject}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {course.institute} ({course.contentType})
        </Typography>
      </CardContent>
      <Divider />
      <CardActions>
        <Button size="small" component={Link} to={`/course/${course.id}`}>
          Open
        </Button>
      </CardActions>
      {/* </CardActionArea> */}
    </Card>
  );
}
