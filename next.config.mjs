import createNextIntlPlugin from "next-intl/plugin";
import { withContentLayer } from "next-content-layer";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withContentLayer(withNextIntl(nextConfig));
