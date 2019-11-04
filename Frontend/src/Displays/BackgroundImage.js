import React from 'react';
import { Button, Header,Grid, Label,Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'

class BackgroundImage extends React.Component {
    state = {
        log: [],
        logCount: 0,
      }
    
      handleHideClick = () => this.setState({ visible: false })
      handleShowClick = () => this.setState({ visible: true })
      handleSidebarHide = () => this.setState({ visible: false })
    
      render() {
        const { visible } = this.state
    
        return (
          <Grid columns={1} className="Grid1">
            <Grid.Row>
              <Grid.Column>
                <Button.Group>
                  <Button disabled={visible} onClick={this.handleShowClick}>
                    Show sidebar
                  </Button>
                  <Button disabled={!visible} onClick={this.handleHideClick}>
                    Hide sidebar
                  </Button>
                </Button.Group>
              </Grid.Column>
            </Grid.Row>
    
            <Grid.Row>
              <Grid.Column>
                <Sidebar.Pushable as={Segment}>
                  <Sidebar
                    as={Menu}
                    animation='overlay'
                    icon='labeled'
                    inverted
                    onHide={() => {
                      this.handleSidebarHide()
                    }}
                    vertical
                    visible={visible}
                    width='thin'
                  >
                    <Menu.Item as='a'>Home</Menu.Item>
                    <Menu.Item as='a'>Games</Menu.Item>
                    <Menu.Item as='a'>Channels</Menu.Item>
                  </Sidebar>
    
                  <Sidebar.Pusher>
                    <Segment basic>
                      <Header as='h3'>Application Content</Header>
                      <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    </Segment>
                  </Sidebar.Pusher>
                </Sidebar.Pushable>
              </Grid.Column>
    
           
            </Grid.Row>
          </Grid>
        )
      }
}
export default BackgroundImage;