import React, { PureComponent } from 'react';
import {
    JSONLD,
    Generic,
} from 'react-structured-data';


class StructuredData extends PureComponent {

  constructor(props) {
    super(props); 
  }

    render() {

        return (
            <JSONLD>
                <Generic type="article"
                    jsonldtype="Article"
                    schema={{
                        headline: this.props.headline,
                        datePublished: this.props.block_time,
                        dateModified: this.props.block_time,
                        author: "inkl.in",
                        publisher: "Inklin",
                        url: this.props.url,

                        articleBody: this.props.description,
                        image: this.props.image
                    }} >
                    <Generic type="publisher" jsonldtype="Organization" schema={{ name: "Inklin" }}>
                        <Generic type="logo" jsonldtype="ImageObject" schema={{ url: "https://www.ethereum.org/images/logos/ETHEREUM-ICON_Black_small.png" }} />
                    </Generic>

                </Generic>

            </JSONLD>

        );
    }
}



export default StructuredData;