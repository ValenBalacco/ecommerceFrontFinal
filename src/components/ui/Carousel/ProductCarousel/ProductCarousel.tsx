import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Detalle } from "../../../../types";
import CardProducts from "../../Cards/CardProducts/CardProducts";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from "./ProductCarousel.module.css";

interface IProps {
  products: Detalle[];
}

const ProductCarousel: FC<IProps> = ({ products }) => {

  const slidesPerView = 4;
  const loopEnabled = products.length > slidesPerView;

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={0}
      slidesPerView={slidesPerView}
      navigation
      pagination={{ clickable: true }}
      loop={loopEnabled}
      className={styles.swiperContainer}
      breakpoints={{
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
        1280: {
          slidesPerView: 4,
        },
        1600: {
          slidesPerView: 5,
        },
      }}
    >
      {products?.map((product) => (
        <SwiperSlide key={product.id} className={styles.swiperSlide}>
          <CardProducts products={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductCarousel;