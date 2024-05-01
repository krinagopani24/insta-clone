import {
  FaSearch,
  FaRegCompass,
  FaCompass,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import {
  AiOutlineHome,
  AiFillHome,
  AiOutlineSearch,
} from "react-icons/ai";
import { BiMoviePlay, BiSolidMoviePlay } from "react-icons/bi";
import { FiMessageSquare } from "react-icons/fi";
import { RiMessage2Fill,RiImageEditLine ,RiImageEditFill  } from "react-icons/ri";
import { TbSquareRoundedPlus, TbSquareRoundedPlusFilled } from "react-icons/tb";

export const NavbarData =[
  {
    tooltip:'Dashboard',
    icon:[AiFillHome,AiOutlineHome],
    link:'/Dashboard',
    children:'Dashboard'
  },
  {
    tooltip:'Search',
    icon:[FaSearch,AiOutlineSearch],
    link:'/Search',
    children:'Search'
  },
  {
    tooltip:'Explore',
    icon:[FaCompass,FaRegCompass],
    link:'/Explore',
    children:'Explore'
  },
  {
    tooltip:'Reels',
    icon:[BiSolidMoviePlay,BiMoviePlay],
    link:'/Reel',
    children:'Reels'
  },
  {
    tooltip:'Messages',
    icon:[RiMessage2Fill,FiMessageSquare],
    link:'/Chat',
    children:'Messages'
  },
  {
    tooltip:'Notification',
    icon:[FaHeart,FaRegHeart],
    link:'/Notification',
    children:'Notification'
  },
  {
    tooltip:'Create',
    icon:[TbSquareRoundedPlusFilled,TbSquareRoundedPlus],
    link:'/AddPost',
    children:'Create'
  },
  {
    tooltip:'Image Editor',
    icon:[RiImageEditFill,RiImageEditLine],
    link:'/ImageEditor',
    children:'Image Editor'
  },
]