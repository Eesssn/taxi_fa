import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image
} from "react-native";
import TopBar from "./TopBar";
import StarRating from "react-native-star-rating";

const { width } = Dimensions.get("window");

class CarDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 3.5
    };
  }

  render() {
    return (
      <View style={styles.Container}>
        <View style={styles.headerRow}>
          <Image
            source={{ uri: this.props.Data.driver_image_url }}
            style={styles.driverimage}
          />
          <StarRating
            disabled={true}
            maxStars={5}
            fullStarColor="#eeee00"
            halfStarColor="#eeee00"
            starSize={20}
            rating={this.props.Data.driver_rating}
          />
          <Text style={styles.driverName}>{this.props.Data.driver_name}</Text>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailColumn}>
            <Text style={{ fontFamily: "Medium" }}>مدل ماشین</Text>
            <Text style={{ fontFamily: "Medium" }}>
              {this.props.Data.driver_car_brand}
            </Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={{ fontFamily: "Medium" }}>
              {this.props.Data.driver_car_number}
            </Text>
            <Text style={{ fontFamily: "Medium" }}>شماره پلاک</Text>
          </View>
          <View>
            <Text style={{ fontFamily: "Medium" }}>
              {this.props.Data.driver_car_color}
            </Text>
            <Text style={{ fontFamily: "Medium" }}>رنگ ماشین</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    marginTop: 10,
    paddingBottom: 10
  },
  headerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-around"
  },
  driverimage: {
    width: width / 4,
    height: width / 4,
    borderRadius: width / 8,
    padding: 1,
    borderColor: "#000",
    borderWidth: 0.5
  },
  driverName: {
    fontFamily: "Medium",
    fontSize: 14
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around"
  },
  detailColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-around"
  },
  footerRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  whiteButton: {
    borderColor: "#707070",
    borderWidth: 1,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 10,
    marginLeft: 15,
    marginRight: 15
  },
  whiteButtonText: {},
  primaryButton: {
    backgroundColor: "#2A2E43",
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 30,
    paddingLeft: 30,
    borderRadius: 10,
    marginRight: 15,
    marginLeft: 15
  },
  primaryButtonText: {
    fontFamily: "Medium",
    color: "#fff"
  }
});

export default CarDetail;
