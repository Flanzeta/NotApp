import {
  Container,
  Box,
  SimpleGrid,
  Image,
  Flex,
  Heading,
  Text,
  Stack,
  StackDivider,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  IoBarChartOutline,
  IoChatboxEllipsesOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
/* import {
  FcAssistant,
  FcDonate,
  FcInTransit,
} from "react-icons/fc"; */

const Feature = ({ text, icon, iconBg }) => {
  return (
    <Stack direction={"row"} align={"center"}>
      <Flex
        w={8}
        h={8}
        align={"center"}
        justify={"center"}
        rounded={"full"}
        bg={iconBg}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{text}</Text>
    </Stack>
  );
};
const Feature_dos = ({ title, text, icon }) => {
  return (
    <Stack>
      <Text fontWeight={600} color={"black"}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  );
};
export default function SplitWithImage() {
  return (
    <Container maxW={"5xl"} py={12}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Stack spacing={4} id="como-funciona">
          <Heading>¿Como funciona?</Heading>
          <Text color={"black"} fontSize={"lg"}>
            NotApp cuenta con las siguientes funcionalidades:
          </Text>
          <Stack
            spacing={4}
            divider={
              <StackDivider
                borderColor={useColorModeValue("gray.100", "gray.700")}
              />
            }
          >
            <Feature
              icon={
                <Icon as={IoBarChartOutline} color={"yellow.500"} w={5} h={5} />
              }
              iconBg={useColorModeValue("yellow.100", "yellow.900")}
              text={
                <Text fontSize={"20px"} color={"gray.500"}>
                  Mantener un seguimiento de tus notas, promedios, tareas y evaluaciones.
                </Text>
              }
            />
            <Feature
              icon={<Icon as={IoChatboxEllipsesOutline} color={"green.500"} w={5} h={5} />}
              iconBg={useColorModeValue("green.100", "green.900")}
              text={
                <Text fontSize={"20px"} color={"gray.500"}>
                  Una mejor comunicación entre profesor y apoderado.
                </Text>
              }
            />
            <Feature
              icon={
                <Icon as={IoInformationCircleOutline} color={"purple.500"} w={5} h={5} />
              }
              iconBg={useColorModeValue("purple.100", "purple.900")}
              text={
                <Text fontSize={"20px"} color={"gray.500"}>
                  Entrega de información de utilidad para estudiantes de todo curso.
                </Text>
              }
            />
          </Stack>
        </Stack>
        <Flex>
          <Image
            /* style={{width: 400, height: 400, borderRadius: 400/ 2}} */
            rounded={"md"}
            alt={"feature image"}
            src={
              "https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            }
            objectFit={"cover"}
          />
        </Flex>
      </SimpleGrid>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Box p={4} id="nosotros">
      <Heading mb={20} fontSize={45}>Nosotros</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Flex direction="column" align="center" justify="center">
            <Image
              rounded="full"
              alt="feature image"
              src="/flan.jpg"
              objectFit="cover"
              boxSize="200px"
            />
            <Feature_dos
              title="Cristian Ilic"
              text="Estudiante 5to semestre Analista Programador Computacional Duoc UC"
            />
          </Flex>
          <Flex direction="column" align="center" justify="center">
            <Image
              rounded="full"
              alt="feature image"
              src="/sho.png"
              objectFit="cover"
              boxSize="200px"
            />
            <Feature_dos
              title="Marcelo Aguilera"
              text="Estudiante 5to semestre Analista Programador Computacional Duoc UC"
            />
          </Flex>
          <Flex direction="column" align="center" justify="center">
            <Image
              rounded="full"
              alt="feature image"
              src="/xavier.png"
              objectFit="cover"
              boxSize="200px"
            />
            <Feature_dos
              title="Javier Sandoval"
              text="Estudiante 5to semestre Analista Programador Computacional Duoc UC"
            />
          </Flex>
        </SimpleGrid>
      </Box>
    </Container>
  );
}

