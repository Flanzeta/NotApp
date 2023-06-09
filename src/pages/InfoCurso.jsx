import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";

import { useState } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import {
  collection,
  orderBy,
  query,
  where,
  getFirestore,
  writeBatch,
  doc,
} from "firebase/firestore";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { HiOutlineMail } from "react-icons/hi";

import { useForm, Controller } from "react-hook-form";
import useNotifications from "../hooks/useNotifications";

const InfoCurso = () => {
  const toast = useToast();
  const [edit, setEdit] = useState(false);
  const [editedAlumnos, setEditedAlumnos] = useState([]);
  const { sendNotification } = useNotifications();
  const { id } = useParams();
  const db = getFirestore();

  const { register, handleSubmit, control, getValues } = useForm();
  const [idCurso, idAsignatura] = id.split("@");

  const alumnosRef = collection(useFirestore(), "usuario");
  const filteredAlumnosRef = query(alumnosRef, where("rol", "==", "alumno"));
  const orderedAlumnosRef = query(
    filteredAlumnosRef,
    orderBy("apellidos"),
    where("idCurso", "==", idCurso)
  );

  // subscribe to a document for realtime updates. just one line!
  const { status, data: alumnos } =
    useFirestoreCollectionData(orderedAlumnosRef);
  if (status === "loading") {
    return <Spinner color="primary" />;
  }

  const onSubmit = async (data) => {
    const batch = writeBatch(db);
    const asignaturaFormat = idAsignatura.replaceAll("_", " ");

    alumnos.forEach(({ NO_ID_FIELD, asignaturas }) => {
      const alumnoRef = doc(db, "usuario", NO_ID_FIELD);
      let notas = [];

      Object.keys(data)
        .filter((key) => key.split("_")[1] === NO_ID_FIELD)
        .forEach((key) => {
          notas = [...notas, data[key]];
        });

      const promedio = notas
        .map(parseFloat)
        .reduce((acc, value) => {
          return (
            acc +
            value / asignaturas[idAsignatura].notas.filter((e) => e != 0).length
          );
        }, 0)
        .toFixed(1);

      const asignaturasActualizadas = {
        ...asignaturas,
        [asignaturaFormat]: {
          notas: notas,
          promedio: promedio,
        },
      };

      batch.update(alumnoRef, {
        asignaturas: asignaturasActualizadas,
      });
    });

    await batch.commit();

    await sendNotification(
      editedAlumnos.map((id) => {
        const { nombres, apellidos } = alumnos.find(
          (alumno) => alumno.NO_ID_FIELD === id
        );
        return {
          contenido: `El alumno ${nombres} ${apellidos} ha recibido una actualización de notas en la asignatura ${asignaturaFormat}`,
          sufferedChangeIds: id,
        };
      })
    );

    toast({
      title: "Notas actualizadas",
      description: "Las notas se han actualizado correctamente",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setEdit(false);
  };

  return (
    <div>
      <Link to="/profesor">
        <Button
          size="md"
          bg="primary"
          color="white"
          mb="5px"
          display="flex"
          _hover={{ background: "primaryHover" }}
        >
          <ArrowBackIcon />
        </Button>
      </Link>

      <TableContainer as={"form"} bgColor="white" borderRadius="8px">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>N°</Th>
              <Th>Alumno</Th>
              <Th>Nota 1</Th>
              <Th>Nota 2</Th>
              <Th>Nota 3</Th>
              <Th>Nota 4</Th>
              <Th>Nota 5</Th>
              <Th>Nota 6</Th>
              <Th>Nota 7</Th>
              <Th>Nota 8</Th>
              <Th>Nota 9</Th>
              <Th>Nota 10</Th>
              <Th>Promedio</Th>
            </Tr>
          </Thead>
          <Tbody>
            {alumnos.map(
              (
                { NO_ID_FIELD, rut, nombres, apellidos, asignaturas },
                index
              ) => (
                <Tr key={rut}>
                  <Td>{index + 1}</Td>
                  <Td>{`${apellidos} ${nombres}`}</Td>
                  {asignaturas[idAsignatura.replaceAll("_", " ")].notas.map(
                    (nota, index) => (
                      <>
                        {edit ? (
                          <Td>
                            <Controller
                              defaultValue={nota}
                              render={({ field: { onBlur, ...rest } }) => (
                                <Input
                                  w="60px"
                                  bgColor={"white"}
                                  {...rest}
                                  onBlur={(e) => {
                                    if (!editedAlumnos.includes(NO_ID_FIELD)) {
                                      setEditedAlumnos((prev) => [
                                        ...prev,
                                        NO_ID_FIELD,
                                      ]);
                                    }

                                    onBlur(e.target.value);
                                  }}
                                />
                              )}
                              name={`${index + 1}_${NO_ID_FIELD}`}
                              control={control}
                            />
                          </Td>
                        ) : (
                          <Td>{nota}</Td>
                        )}
                      </>
                    )
                  )}
                  <Td>
                    {!isNaN(
                      asignaturas[idAsignatura].notas
                        .map(parseFloat)
                        .reduce((acc, value) => {
                          return (
                            acc +
                            value /
                              asignaturas[idAsignatura].notas.filter(
                                (e) => e != 0
                              ).length
                          );
                        }, 0)
                    )
                      ? asignaturas[idAsignatura].notas
                          .map(parseFloat)
                          .reduce((acc, value) => {
                            return (
                              acc +
                              value /
                                asignaturas[idAsignatura].notas.filter(
                                  (e) => e != 0
                                ).length
                            );
                          }, 0)
                          .toFixed(1)
                      : "Sin notas"}
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {!edit && (
        <Button
          mt="30px"
          bg="primary"
          color="white"
          _hover={{ bg: "primaryHover" }}
          onClick={() => setEdit((e) => !e)}
        >
          Editar
        </Button>
      )}

      {edit && (
        <Button
          mt="30px"
          bg="green.400"
          color="white"
          _hover={{ bg: "green.600" }}
          onClick={() => handleSubmit(onSubmit)()}
        >
          Guardar
        </Button>
      )}
    </div>
  );
};

export default InfoCurso;
