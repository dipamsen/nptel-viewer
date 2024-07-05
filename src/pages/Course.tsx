import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import { CourseInfo } from "../types";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";

function App() {
  const [course, setCourse] = useState<CourseInfo>();
  const [loading, setLoading] = useState(false);
  const [lessonId, setLessonId] = useState<number>(0);
  const { id } = useParams<{
    id: string;
  }>();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`https://nptel.deno.dev/course?id=${id}`);
      const data: CourseInfo = await res.json();
      setCourse(data);
      setLoading(false);
    }
    setLoading(true);
    fetchData();
  }, []);

  function removeNonPrintableCharacters(str: string) {
    return str.replace(/[^\x20-\x7E]/g, "");
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ marginTop: "20px" }}>
        {loading && <CircularProgress />}

        {!loading &&
          course &&
          (() => {
            const lessons = [
              {
                title: "Course Introduction",
                description: removeNonPrintableCharacters(course.abstract),
                videoId: course.introVideoId,
              },
              ...course.chapters
                .map((chapter) =>
                  chapter.lessons.map((lesson) => ({
                    title: lesson.name,
                    description: lesson.description,
                    videoId: lesson.videoId,
                  }))
                )
                .flat(),
            ];
            return (
              <Box>
                <Typography variant="h3">{course.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.professor}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} my={2}>
                  <Avatar
                    src={course.instituteLogo}
                    alt={course.institute}
                    sx={{ bgcolor: "white" }}
                  />
                  <Typography variant="body2">{course.institute}</Typography>
                </Box>
                <Box display="flex" gap={2} my={2}>
                  <YouTube videoId={lessons[lessonId].videoId} />
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="h5">
                      {lessons[lessonId].title}
                    </Typography>
                    <Typography variant="body1">
                      {lessons[lessonId].description}
                    </Typography>

                    <Box display="flex" gap={2} my={2} width="100%">
                      <Button
                        sx={{ width: "100%" }}
                        variant="outlined"
                        onClick={() =>
                          setLessonId((lessonId - 1) % lessons.length)
                        }
                        disabled={lessonId === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        sx={{ width: "100%" }}
                        variant="outlined"
                        onClick={() =>
                          setLessonId((lessonId + 1) % lessons.length)
                        }
                        disabled={lessonId === lessons.length - 1}
                      >
                        Next
                      </Button>
                    </Box>
                  </Box>{" "}
                  {/* right info */}
                </Box>{" "}
                {/* yt area */}
                <Typography variant="h5">Assignments</Typography>
                {course.downloadables.assignments.map((assignment) => (
                  <Box key={assignment.title} display={"flex"} gap={2}>
                    <Typography variant="body1">{assignment.title}</Typography>
                    <Button
                      variant="outlined"
                      href={assignment.url}
                      target="_blank"
                    >
                      Download
                    </Button>
                    <Divider />
                  </Box>
                ))}
              </Box>
            );
          })()}
      </Container>
    </>
  );
}

export default App;
