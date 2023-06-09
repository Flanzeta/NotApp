import React from "react";
import { doc, getFirestore } from "firebase/firestore";
import { auth } from "../AuthContext";
import { useAuth, useSigninCheck, useFirestoreDocData } from "reactfire";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiInfo,
} from "react-icons/fi";
import { TbRuler2 } from "react-icons/tb";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Notifications from "./Notifications";

const LinkItems = [
  { name: "Profesor", icon: TbRuler2, canSee: ["profesor"] },
  { name: "Admini", icon: FiCompass },
  { name: "Calendario", icon: FiStar, canSee: ["profesor", "apoderado"] },
  { name: "Contacto", icon: FiSettings, canSee: ["profesor", "apoderado"] },
  { name: "Apoderado", icon: FiTrendingUp, canSee: ["apoderado"] },
  { name: "Informacion", icon: FiInfo, canSee: ["profesor", "apoderado"] },
];

export default function Navbar({ Outlet }) {
  const { status } = useSigninCheck();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;

  if (status === "loading") {
    return <Spinner color="primary" />;
  }

  return (
    <Box minH="100vh" bg={useColorModeValue("background", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Outlet context={{ uid }} />
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {
  const db = getFirestore();
  const { currentUser } = useAuth();
  const ref = doc(db, "usuario", currentUser?.uid);
  const { status: statusUsuario, data: usuario } = useFirestoreDocData(ref);
  if (statusUsuario === "loading") {
    return <Spinner color="primary" />;
  }

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("#141414", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("#141414", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="200" alignItems="center" mx="8" justifyContent="center">
        <VStack align={"center"} className="navbar-izq">
          <Text onClick={() => navigate("/")} fontSize="2xl" fontWeight="bold">
            <img src="../logonotapp.png" alt="Logo NotApp" />
            NotApp
          </Text>
        </VStack>

        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.filter(({ canSee }) => canSee?.includes(usuario.rol)).map(
        (link) => {
          return (
            <NavItem
              key={link.name}
              url={link.name}
              icon={link.icon}
              color={"white"}
              _hover={{
                background: "primary",
              }}
            >
              {link.name}
            </NavItem>
          );
        }
      )}
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Link
      to={`/${rest.url}`}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  const navigate = useNavigate();
  const db = getFirestore();
  const { currentUser } = useAuth();
  const alumnosRef = doc(db, "usuario", currentUser.uid);
  const { status: status, data: usuario } = useFirestoreDocData(alumnosRef);
  const rol = usuario?.rol;

  if (status === "loading") {
    return <Spinner color="primary" />;
  }

  const logout = async () => {
    await signOut(auth);
    console.log("Se cerró sesión");
    navigate("/");
  };
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("#141414", "gray.900")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Notifications />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{currentUser?.displayName}</Text>

                  <Text fontSize="xs" color="gray.600">
                    {rol.charAt(0).toUpperCase() + rol.slice(1)}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>

            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem onClick={logout}>Cerrar sesión</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
