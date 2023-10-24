import './termsAndConditions.style.scss'
import { FunctionComponent } from 'react'
interface TermsAndConditionsProps {
  setModalTermsOpen?: React.Dispatch<React.SetStateAction<boolean>>
  setModalPrivacyOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const TermsAndConditions: FunctionComponent<TermsAndConditionsProps> = ({
  setModalPrivacyOpen,
  setModalTermsOpen,
}) => {
  return (
    <div className="terms">
      <p>
        <strong>
          Die vorliegenden allgemeinen Geschäftsbedingungen treten per 30. April
          2023 in Kraft.
        </strong>
      </p>
      <p>
        <strong>
          Diese allgemeinen Geschäftsbedingungen regeln Ihre Nutzung der
          kostenlosen und kostenpflichtigen Dienste, Software und Websites (der
          „Dienst“), die von derseitenschneider bereitgestellt werden. "Eleno"
          und alle Daten, Texte, Dateien, Informationen, Benutzernamen, Bilder,
          Grafiken, Fotos, Profile, Audio- und Videoclips, Sounds, Musikwerke,
          Werke der Urheberschaft, Anwendungen, Links, erstellte Schülerdaten,
          erstellte Lektionsdaten, erstellte Notizen erstellte Aufgaben und
          zugehörige Informationen, Texte, Dateien und andere Inhalte oder
          Materialien (zusammen die „Inhalte“), die hochgeladen, heruntergeladen
          oder auf unseren Websites oder Anwendungen erscheinen.
        </strong>
      </p>
      <p>
        <strong>
          Unsere{' '}
          <a
            href="#"
            onClick={() => {
              setModalTermsOpen(false)
              setModalPrivacyOpen(true)
            }}
          >
            Datenschutzbestimmungen
          </a>{' '}
          erläutert, wie wir Ihre Daten erfassen und verwenden. Durch die
          Nutzung des Dienstes stimmen Sie zu, an diese Bedingungen und unsere
          Datenschutzrichtlinie gebunden zu sein. Wenn Sie unseren Dienst im
          Namen einer Organisation oder eines Unternehmens („Organisation“)
          nutzen, stimmen Sie diesen Bedingungen im Namen dieser Organisation zu
          und erklären und garantieren, dass Sie befugt sind, die Organisation
          an diese Bedingungen zu binden. In diesem Fall beziehen sich „Sie“ und
          „Ihr“ auf diese Organisation.
        </strong>
      </p>
      <p>
        <strong>
          Unsere allgemeinen Geschäftsbedingungen und Datenschutzbestimmungen
          wirken sich auf Ihre gesetzlichen Rechte und Pflichten aus. Wenn Sie
          nicht damit einverstanden sind, an alle diese gebunden zu sein,
          greifen Sie nicht auf unseren Service zu und nutzen Sie ihn nicht.
        </strong>
      </p>

      <p>
        <strong>
          HINWEIS ZU SCHIEDSVERFAHREN: SOFERN SIE SICH NICHT ABWEICHEN UND MIT
          AUSNAHME BESTIMMTER ARTEN VON STREITIGKEITEN, DIE IM ABSCHNITT
          SCHIEDSVERFAHREN UNTEN BESCHRIEBEN SIND, STIMMEN SIE ZU, DASS
          STREITIGKEITEN ZWISCHEN IHNEN UND UNS DURCH EIN VERBINDLICHES,
          INDIVIDUELLES SCHIEDSVERFAHREN BEIGELEGT WERDEN, UND SIE VERZICHTEN
          AUF IHR RECHT, AN EINER SAMMELKLAGE TEILZUNEHMEN ODER KLASSENWEITES
          SCHIEDSVERFAHREN ANZUSTREBEN.
        </strong>
      </p>
      <h3 className="heading-3">Ihr Benutzerkonto und Inhalt</h3>
      <ol>
        <li>
          Beim Erstellen eines Benutzerkontos müssen Sie Ihre Daten
          wahrheitsgemäss ausfüllen
        </li>
        <li>
          Sie sind für die Aufbewahrung des Passworts und für alle Aktivitäten
          verantwortlich, die unter Ihrem Konto stattfinden. Sie sollten uns
          unverzüglich benachrichtigen, wenn Sie eine Sicherheitsverletzung oder
          unbefugte Nutzung Ihres Kontos bemerken.
        </li>
        <li>
          Sie dürfen niemals das Konto eines anderen Benutzers ohne dessen
          ausdrückliche Erlaubnis verwenden.
        </li>
        <li>
          Sie dürfen den Dienst nicht auseinanderbauen, dekompilieren oder
          zurückentwickeln oder versuchen oder jemand anderen dabei
          unterstützen, es sei denn, eine solche Einschränkung ist gesetzlich
          verboten.
        </li>
        <li>
          Ihr Konto muss von einem Menschen registriert werden. Konten, die von
          „Bots“ oder anderen automatisierten Methoden registriert wurden, sind
          nicht zulässig.
        </li>
        <li>
          Sie dürfen den Dienst nicht für illegale oder unbefugte Zwecke nutzen.
          Sie erklären sich damit einverstanden, alle Gesetze, Regeln und
          Vorschriften (z. B. auf Bundes-, Landes-, lokaler und Provinzebene)
          einzuhalten, die für Ihre Nutzung des Dienstes und Ihrer Inhalte (wie
          unten definiert) gelten, einschließlich, aber nicht beschränkt auf
          Urheberrechtsgesetze.
        </li>

        <li>
          Falls Sie ein kostenpflichtiges Konto haben, werden Gebühren nicht
          erstattet, es sei denn, dies ist gesetzlich vorgeschrieben. Sie zahlen
          alle anfallenden Gebühren bei Fälligkeit, und wenn diese Gebühren per
          Kreditkarte oder auf andere elektronische Weise bezahlt werden,
          ermächtigen Sie uns, diese Gebühren mit der von Ihnen gewählten
          Zahlungsmethode zu berechnen. Standardmäßig sind Kundenkonten auf
          automatische Verlängerung eingestellt, und wir können Ihnen eine
          solche Verlängerung am oder nach dem mit Ihrem Konto verknüpften
          Verlängerungsdatum automatisch in Rechnung stellen, es sei denn, Sie
          haben den Dienst vor dem Verlängerungsdatum gekündigt. Wir können die
          Gebührensätze für den Dienst von Zeit zu Zeit überarbeiten und werden
          Sie mindestens dreißig (30) Tage vor dem Erneuerungsdatum Ihres
          Dienstes per E-Mail über Gebührenänderungen informieren. Sie sind
          dafür verantwortlich, Eleno vollständige und genaue
          Rechnungsinformationen bereitzustellen. Wir können Ihre Nutzung des
          Dienstes aussetzen oder beenden, wenn Gebühren überfällig werden. Sie
          sind für alle Steuern verantwortlich (mit Ausnahme von Steuern auf
          unser Nettoeinkommen), und wir erheben Steuern, wenn dies gesetzlich
          vorgeschrieben ist. <br />
          <br />
          Wenn Sie die Verwendung einer Bestellung oder Bestellnummer benötigen,
          müssen Sie (a) die Bestellnummer zum Zeitpunkt des Kaufs angeben; und
          (b) stimmen Sie zu, dass alle Geschäftsbedingungen Ihrer Bestellung
          nicht gelten und null und nichtig sind.
        </li>
      </ol>
      <h3 className="heading-3">Ihre Nutzung unseres Dienstes</h3>
      <ol>
        <li>
          Sie dürfen den Dienst nicht ändern, modifizieren, anpassen oder ändern
          oder eine andere Website ändern, modifizieren oder ändern, um
          fälschlicherweise anzudeuten, dass sie mit dem Dienst oder mit uns
          verbunden ist.
        </li>
        <li>
          Sie dürfen auf unsere private API nur mit den ausdrücklich von uns
          erlaubten Mitteln zugreifen.
        </li>
        <li>
          Sie dürfen den Dienst oder mit dem Dienst verbundene Server oder
          Netzwerke nicht stören, einschließlich durch Übertragung von Viren,
          Spyware, Malware oder anderen Codes zerstörerischer oder störender
          Natur. Sie dürfen keine Inhalte oder Codes einfügen oder die Art und
          Weise, wie unsere Seite im Browser oder Gerät eines Benutzers
          gerendert oder angezeigt wird, anderweitig ändern oder stören.
        </li>
        <li>
          Sie dürfen nicht versuchen, einen anderen Benutzer daran zu hindern,
          den Dienst zu nutzen oder zu nutzen, und Sie dürfen Verstöße gegen
          diese Bedingungen oder eine unserer anderen Bedingungen nicht fördern
          oder erleichtern.
        </li>
        <li>
          Als Teil des Dienstes können wir herunterladbare Client-Software (die
          „Software“) für Ihre Verwendung in Verbindung mit dem Dienst
          bereitstellen. Diese Software kann automatisch aktualisiert werden,
          und wenn diese Software für die Verwendung auf einem bestimmten Mobil-
          oder Desktop-Betriebssystem konzipiert ist, ist für die Verwendung ein
          kompatibles System erforderlich. Solange Sie diese Bedingungen
          einhalten, gewähren wir Ihnen eine beschränkte, nicht ausschließliche,
          nicht übertragbare, widerrufliche Lizenz zur Nutzung der Software,
          ausschließlich für den Zugriff auf den Dienst; vorausgesetzt jedoch,
          dass diese Lizenz keinen Verkauf der Software oder einer Kopie davon
          darstellt, und wir zwischen Ihnen und uns alle Rechte, Titel und
          Interessen an der Software behalten. Sie stimmen zu, dass Sie nicht
          kopieren, reproduzieren, neu veröffentlichen, herunterladen,
          übertragen, modifizieren, anzeigen, zurückentwickeln, verkaufen oder
          an einem Verkauf, Vermietung, Leasing, Verleih, Abtretung, Verteilung,
          Lizenzierung, Unterlizenzierung oder Verwertung teilnehmen in
          irgendeiner Weise, ganz oder teilweise, unsere Inhalte, die Dienste
          oder damit verbundene Software, außer wie ausdrücklich in diesen
          Bedingungen angegeben.
        </li>
        <li>
          Ein Verstoß gegen diese Bedingungen kann nach unserem alleinigen
          Ermessen zur Kündigung Ihres Kontos führen. Darüber hinaus behalten
          wir uns das Recht vor, Verstöße gegen diese Bedingungen im vollen
          Umfang des Gesetzes zu untersuchen und strafrechtlich zu verfolgen.
          Wir können Strafverfolgungsbehörden einbeziehen und mit ihnen
          zusammenarbeiten, um Benutzer, die gegen die Bedingungen verstoßen,
          strafrechtlich zu verfolgen. Sie erkennen an, dass wir nicht
          verpflichtet sind, Ihren Zugriff auf oder Ihre Nutzung unseres
          Dienstes oder von Informationen, Materialien oder anderen Inhalten,
          die über unseren Dienst bereitgestellt oder verfügbar gemacht werden,
          vorab zu überprüfen oder zu überwachen, aber das Recht dazu haben. Sie
          stimmen hiermit zu, dass wir nach eigenem Ermessen Daten, Konten oder
          andere Inhalte entfernen oder löschen können, die gegen diese
          Bedingungen verstoßen oder die anderweitig anstößig sind
        </li>
        <li>
          Wenn Sie sich dafür entscheiden, eine Drittanbieteranwendung in
          Verbindung mit Ihrer Nutzung des Dienstes zu verwenden, stimmen Sie
          damit zu, dass Ihre Inhalte mit dieser Drittanbieteranwendung geteilt
          werden. Um zu verstehen, wie solche Drittanbieter von Anwendungen Ihre
          Inhalte und andere Informationen verwenden, sollten Sie deren
          Datenschutzrichtlinie lesen.
        </li>
      </ol>
      <h3 className="heading-3">Allgemeine Bedingungen</h3>
      <ol>
        <li>
          Wir können Ihr(e) Konto(s) sperren oder kündigen oder die
          Bereitstellung aller oder eines Teils unserer Dienste jederzeit ohne
          Haftung Ihnen gegenüber aus irgendeinem Grund einstellen,
          einschließlich, aber nicht beschränkt auf, wenn wir Grund zu der
          Annahme haben, dass: (i) Sie diese Bedingungen verletzt haben, (ii)
          Sie ein Risiko oder eine mögliche rechtliche Gefährdung für uns
          schaffen, (iii) unsere Bereitstellung unserer Dienste an Sie nicht
          mehr wirtschaftlich rentabel ist. Wir werden angemessene Anstrengungen
          unternehmen, um Sie über unseren Service zu benachrichtigen, wenn Sie
          das nächste Mal versuchen, auf Ihr Konto zuzugreifen, oder über eine
          E-Mail-Adresse oder Telefonnummer, die Sie uns (falls zutreffend) zur
          Verfügung gestellt haben. Wenn wir Ihren Zugriff auf den Dienst
          beenden, sind Ihre Inhalte und alle anderen Daten nicht mehr über Ihr
          Konto zugänglich.
        </li>
        <li>
          Mit der Kündigung erlöschen alle Lizenzen und sonstigen Rechte, die
          Ihnen in diesen Bedingungen gewährt werden, unverzüglich.
        </li>
        <li>
          Wir behalten uns das Recht vor, diese Bedingungen und/oder unsere von
          Zeit zu Zeit angebotenen Dienste nach eigenem Ermessen zu ändern.
          Sofern wir keine Änderung aus rechtlichen oder administrativen Gründen
          vornehmen, werden wir Sie rechtzeitig vor dem Inkrafttreten der
          aktualisierten Bedingungen informiert. Sie erklären sich damit
          einverstanden, dass wir Sie über die aktualisierten Bedingungen
          informieren können, indem wir sie auf dem Dienst veröffentlichen, und
          dass Ihre Nutzung des Dienstes nach dem Datum des Inkrafttretens der
          aktualisierten Bedingungen (oder die Beteiligung an einem anderen von
          uns angemessen festgelegten Verhalten) Ihre Zustimmung zu den
          aktualisierten Bestimmungen darstellt. Daher sollten Sie diese
          Bedingungen und alle aktualisierten Bedingungen lesen, bevor Sie den
          Service nutzen. Die aktualisierten Bedingungen treten zum Zeitpunkt
          der Veröffentlichung oder zu einem späteren Datum, welches in den
          aktualisierten Bedingungen angegeben wird, in Kraft und gelten ab
          diesem Zeitpunkt für Ihre Nutzung des Dienstes. Diese Bedingungen
          regeln alle Streitigkeiten, die vor dem Datum des Inkrafttretens der
          aktualisierten Bedingungen entstehen.
        </li>
        <li>
          Wir behalten uns das Recht vor, den Zugriff auf den Dienst jederzeit
          und ohne Angabe von Gründen zu verweigern.
        </li>
        <li>
          Sie ermächtigen uns hiermit, direkt oder über Dritte, alle Anfragen zu
          stellen, die wir für erforderlich halten, um Ihre Identität zu
          validieren und/oder Ihre Identität und Kontoinformationen zu
          authentifizieren. Dies kann beinhalten, dass Sie um weitere
          Informationen und/oder Unterlagen über Ihre Kontonutzung oder
          Identität gebeten werden oder Sie aufgefordert werden, Schritte zu
          unternehmen, um den Besitz Ihrer E-Mail-Adresse, Mobilfunknummer oder
          Finanzinstrumente zu bestätigen, und Ihre Informationen anhand von
          Datenbanken Dritter zu überprüfen oder über andere Quellen. Dieser
          Vorgang dient internen Überprüfungszwecken. Sie verstehen ferner, dass
          wir für diesen Verifizierungsprozess möglicherweise eine Gebühr
          erheben.
        </li>
        <li>
          Wir können Inhalte oder Konten, die Inhalte enthalten, die nach
          unserem alleinigen Ermessen gegen diese Bedingungen verstoßen,
          entfernen, bearbeiten, blockieren und/oder überwachen, sind jedoch
          nicht dazu verpflichtet.
        </li>
        <li>
          Sie stimmen zu, dass Sie für alle Datengebühren verantwortlich sind,
          die Ihnen durch die Nutzung des Dienstes entstehen.
        </li>
        <li>
          Wir verbieten das Crawlen, Scrapen, Zwischenspeichern oder
          anderweitige Zugreifen auf Inhalte des Dienstes über automatisierte
          Mittel (außer wenn dies das Ergebnis von
          Standard-Suchmaschinenprotokollen oder -technologien ist, die von
          einer Suchmaschine mit unserer ausdrücklichen Zustimmung verwendet
          werden).
        </li>
        <li>
          In einigen Fällen müssen unsere Mitarbeiter, Auftragnehmer oder
          Vertreter auf Ihr Konto und Ihre Inhalte zugreifen, um ein Problem zu
          diagnostizieren. Wenn Sie sich an unser Support-Team wenden, wird
          impliziert, dass Sie uns erlauben, bei Bedarf auf Ihr Konto
          zuzugreifen, um Ihnen zu helfen. Wenn Sie Unterstützung erhalten
          möchten, ohne Ihrem Konto die Erlaubnis zu erteilen, geben Sie dies
          bitte in Ihrer Kommunikation mit unserem Support-Team an, und diese
          Anfragen werden so weit wie möglich berücksichtigt.
        </li>
        <li>
          Im Zusammenhang mit der Bereitstellung des Dienstes können wir Ihre
          Inhalte in der Schweiz oder in jedem anderen Land, in dem wir oder
          unsere Vertreter Einrichtungen unterhalten, übertragen, speichern und
          verarbeiten. Durch die Nutzung des Dienstes stimmen Sie dieser
          Übertragung, Verarbeitung und Speicherung Ihrer Inhalte zu.
        </li>
      </ol>
      <h3 className="heading-3">Rechte</h3>
      <ol>
        <li>
          <p>
            <strong>Eigentum</strong> Für die Zwecke dieser Bedingungen: (i)
            "Inhalt" bedeutet alle Daten, Texte, Dateien, Informationen,
            Benutzernamen, Bilder, Grafiken, Fotos, Profile, Audio- und
            Videoclips, Sounds, Musikwerke, urheberrechtlich geschützte Werke,
            Anwendungen, Links, erstellte Aufgaben und zugehörige Informationen,
            Texte, Dateien und andere Inhalte oder Materialien; und (ii)
            „Benutzerinhalte“ bezeichnet alle Inhalte, die Kontoinhaber
            (einschließlich Ihnen) bereitstellen, um über die Dienste verfügbar
            gemacht zu werden. Der Inhalt umfasst ohne Einschränkung
            Benutzerinhalte
          </p>
          <p>
            a.{' '}
            <strong>Inhaltseigentuman den von uns erstellten Inhalten </strong>
            <br />
            Sofern nicht anders angegeben, sind alle Materialien, die auf oder
            in den Diensten enthalten sind, einschließlich, aber nicht
            beschränkt auf Texte, Grafiken, Bilder, Codes, Illustrationen,
            Designs, Symbole, Fotos, Videoclips sowie schriftliche und andere
            Materialien (zusammen Eleno-Inhalte ") sowie deren Auswahl und
            Anordnung durch Urheberrechte, Marken, Handelsaufmachungen, Patente
            und/oder andere Gesetze zum Schutz des geistigen Eigentums
            geschützt, und die unbefugte Nutzung von Eleno-Inhalten kann gegen
            diese Gesetze und diese Bedingungen verstoßen. Sofern nicht
            ausdrücklich in diesen Bedingungen vorgesehen, gewähren wir keine
            ausdrücklichen oder stillschweigenden Rechte zur Nutzung von
            Eleno-Inhalten. Sie stimmen zu, dass Sie nicht kopieren,
            reproduzieren, neu veröffentlichen, herunterladen, übertragen,
            modifizieren, anzeigen, zurückentwickeln, verkaufen oder an einem
            Verkauf, Vermietung, Leasing, Verleih, Abtretung, Verteilung,
            Lizenzierung, Unterlizenzierung oder Verwertung teilnehmen in keiner
            Weise, ganz oder teilweise, Eleno-Inhalte, die Dienste oder
            zugehörige Software oder Client-Software wie oben definiert, außer
            wie ausdrücklich in diesen Bedingungen angegeben. Sie stimmen zu,
            keine Hinweise auf Urheberrechte, Marken, Dienstleistungsmarken oder
            andere Eigentumsrechte zu entfernen, zu ändern oder zu verdecken,
            die in den Diensten oder Inhalten enthalten sind oder diese
            begleiten. Sie erkennen an, dass die Dienste und Inhalte durch
            Urheberrechts-, Marken- und andere Gesetze der Vereinigten Staaten
            und anderer Länder geschützt sind.
          </p>
          <p>
            b. <strong>Rechte an Benutzerinhalten</strong> <br />
            Wir beanspruchen keine Eigentumsrechte an den Inhalten, die
            ausschließlich von Ihnen in Ihrem Eleno-Benutzerkonto eingereicht
            oder erstellt wurden. Jeder Inhalt, der Ihnen gehört, bleibt Ihr
            Eigentum. Diese Nutzungsbedingungen gewähren uns keine Lizenzen oder
            Rechte an Ihren Inhalten, mit Ausnahme der eingeschränkten Rechte,
            die wir benötigen, um Ihnen den Eleno-Dienst bereitzustellen.
            Ungeachtet des Vorstehenden können wir auf Inhalte zugreifen, um
            festzustellen, wie wir unseren Service verbessern können, und um die
            Kundenzufriedenheit zu ermitteln. Ebenso bleiben alle Berichtsdaten,
            die wir aus Ihrer Nutzung des Eleno-Dienstes erheben, Ihr Eigentum.
            Durch die Nutzung des Eleno-Dienstes stimmen Sie zu, dass wir diese
            Daten verwenden können, um Ihnen den Eleno-Dienst bereitzustellen,
            und Sie stimmen auch zu, dass wir, solange die Daten anonymisiert
            sind und Sie nicht identifizieren, diese Daten mit den
            anonymisierten Daten anderer kombinieren können um sie Unternehmen,
            Benchmarking, öffentliche Berichte bereitzustellen oder sie
            anderweitig zur Bereitstellung des Eleno-Dienstes zu verwenden.
          </p>
          <p>
            c. <strong>Warnungen und Benachrichtigungen</strong> <br />
            Als Teil der von uns bereitgestellten Dienste können Sie (falls
            aktiviert) Push-Benachrichtigungen, Textnachrichten, Warnungen,
            E-Mails oder andere Arten von Nachrichten erhalten, die außerhalb
            oder innerhalb der App direkt an Sie gesendet werden
            („Benachrichtigungen“). Sie haben die Kontrolle über die
            Benachrichtigungseinstellungen und können diese Benachrichtigungen
            über die Dienste aktivieren oder deaktivieren (mit der möglichen
            Ausnahme von seltenen, wichtigen Dienstankündigungen und
            administrativen Nachrichten).
          </p>
        </li>
        <li>
          Einige der Dienste werden möglicherweise durch Werbeeinnahmen
          unterstützt und können Werbung und Werbeaktionen anzeigen. Sie stimmen
          hiermit zu, dass wir solche Werbung und Werbeaktionen auf den Diensten
          oder auf, über oder in Verbindung mit Ihren Inhalten platzieren
          dürfen. Die Art, der Modus und der Umfang solcher Werbung und
          Werbeaktionen können ohne besondere Benachrichtigung an Sie geändert
          werden.
        </li>
        <li>
          Sie erkennen an, dass wir kostenpflichtige Dienste, gesponserte
          Inhalte oder kommerzielle Mitteilungen möglicherweise nicht immer als
          solche identifizieren
        </li>
        <li>
          Sie versichern und garantieren, dass: (i) Sie Eigentümer der von Ihnen
          auf oder über den Dienst veröffentlichten Inhalte sind oder
          anderweitig das Recht haben, die in diesen Nutzungsbedingungen
          festgelegten Rechte und Lizenzen zu gewähren; (ii) die
          Veröffentlichung und Nutzung Ihrer Inhalte auf oder über den Dienst
          die Rechte Dritter nicht verletzt, missbraucht oder verletzt,
          einschließlich, aber nicht beschränkt auf Datenschutzrechte,
          Veröffentlichungsrechte, Urheberrechte, Marken und/oder andere Rechte
          an geistigem Eigentum; (iii) Sie erklären sich damit einverstanden,
          alle Lizenzgebühren, Gebühren und sonstigen Gelder zu zahlen, die
          aufgrund von Inhalten geschuldet werden, die Sie auf oder über den
          Dienst veröffentlichen; und (iv) Sie haben das gesetzliche Recht und
          die Fähigkeit, diese Nutzungsbedingungen in Ihrer Gerichtsbarkeit
          einzugehen
        </li>

        <li>
          Der Name und das Logo von Eleno sind unsere Warenzeichen und dürfen
          ohne unsere vorherige schriftliche Genehmigung weder ganz noch
          teilweise kopiert, imitiert oder verwendet werden. Darüber hinaus sind
          alle Seitenkopfzeilen, benutzerdefinierten Grafiken,
          Schaltflächensymbole und Skripte unsere Dienstleistungsmarken, Marken
          und/oder Handelsaufmachungen unser geistiges Eigentum und dürfen ohne
          vorherige schriftliche Genehmigung von uns weder ganz noch teilweise
          kopiert, nachgeahmt oder verwendet werden.
        </li>
        <li>
          Obwohl wir beabsichtigen, den Service so weit wie möglich verfügbar zu
          machen, kann es vorkommen, dass der Service unterbrochen wird,
          einschließlich, aber nicht beschränkt auf geplante Wartungsarbeiten
          oder Upgrades, Notfallreparaturen, ungeplante Ausfallzeiten, für
          System und Server Ausfällen oder aufgrund des Ausfalls von
          Telekommunikationsverbindungen und/oder -geräten. Daher empfehlen wir
          Ihnen, eine eigene Sicherungskopie Ihrer Inhalte zu führen. Mit
          anderen Worten, wir sind kein Sicherungsdienst und Sie stimmen zu,
          dass Sie sich nicht auf den Dienst zum Zweck der Sicherung oder
          Speicherung von Inhalten verlassen werden. Wir haften Ihnen gegenüber
          nicht für eine Änderung, Aussetzung oder Einstellung der Dienste oder
          den Verlust von Inhalten. Sie erkennen auch an, dass das Internet
          Sicherheitsverletzungen unterliegen kann und dass die Übermittlung von
          Inhalten oder anderen Informationen möglicherweise nicht sicher ist.
        </li>
        <li>
          Sie stimmen zu, dass wir nicht für Inhalte, die innerhalb des Dienstes
          veröffentlicht werden, verantwortlich sind und diese nicht
          unterstützen. Wir sind nicht verpflichtet, Inhalte vorab zu prüfen, zu
          überwachen, zu bearbeiten oder zu entfernen. Wenn Ihre Inhalte gegen
          diese Bedingungen verstoßen, können Sie die rechtliche Verantwortung
          für diese Inhalte tragen
        </li>
        <li>
          Sofern in den{' '}
          <a
            href="#"
            onClick={() => {
              setModalTermsOpen(false)
              setModalPrivacyOpen(true)
            }}
          >
            Datenschutzbestimmungen
          </a>{' '}
          des Dienstes nicht anders beschrieben, sind zwischen Ihnen und uns
          alle Inhalte nicht vertraulich und nicht urheberrechtlich geschützt,
          und wir haften nicht für die Verwendung oder Offenlegung von Inhalten.
          Sie erkennen an und stimmen zu, dass Ihre Beziehung zu uns keine
          vertrauliche, treuhänderische oder andere Art von besonderer Beziehung
          ist und dass Ihre Entscheidung, Inhalte einzureichen, uns nicht in
          eine Position versetzt, die sich von der Position unterscheidet, die
          Mitglieder der Öffentlichkeit, einschließlich in Bezug auf Ihre
          Inhalte. Keiner Ihrer Inhalte unterliegt unsererseits einer
          Vertraulichkeitsverpflichtung, und wir haften nicht für die Nutzung
          oder Offenlegung der von Ihnen bereitgestellten Inhalte.
        </li>
        <li>
          <p>
            Vorbehaltlich Ihrer Zustimmung und fortgesetzten Einhaltung dieser
            Bedingungen und aller unserer anderen relevanten Richtlinien
            gewähren wir Ihnen eine nicht ausschließliche, nicht übertragbare,
            widerrufliche eingeschränkte Lizenz zur Nutzung des Dienstes
            ausschließlich für die beabsichtigten Zwecke. Sie stimmen zu, den
            Service nicht für andere Zwecke zu nutzen.
          </p>
          <p>
            Diese Lizenz ist jederzeit widerrufbar. Diese Lizenz unterliegt
            diesen Bedingungen und beinhaltet nicht:
          </p>
          <p>
            d. Die Verbreitung, öffentliche Aufführung oder öffentliche Anzeige
            unserer Inhalte;
          </p>
          <p>
            e. Modifizieren oder anderweitig abgeleitete Nutzungen der Dienste
            oder unserer Inhalte oder eines Teils davon;
          </p>
          <p>
            f. Verwendung von Scraping, Data Mining, Robotern oder ähnlichen
            Methoden zum Sammeln oder Extrahieren von Daten;
          </p>
          <p>
            g. Herunterladen (mit Ausnahme von Seiten-Caching) eines Teils der
            Dienste, unserer Inhalte oder darin enthaltener Informationen, es
            sei denn, dies ist ausdrücklich in den Diensten gestattet;
          </p>
          <p>
            h. Zugriff auf unsere API mit einem nicht autorisierten oder
            Drittanbieter-Client; und
          </p>
          <p>
            i. Jegliche Nutzung der Dienste oder unserer Inhalte zu anderen als
            den beabsichtigten Zwecken.
          </p>
          <p>
            j. Jegliche Nutzung der Dienste oder unserer Inhalte, die nicht
            ausdrücklich in diesen Bedingungen gestattet ist, ist ohne unsere
            vorherige schriftliche Genehmigung strengstens untersagt und beendet
            die in diesen Bedingungen gewährte Lizenz zur Nutzung unseres
            Dienstes und unserer Website.
          </p>
        </li>
        <li>
          <p>
            Es ist unsere Richtlinie, keine Inhalte, Informationen, Ideen,
            Vorschläge oder andere Materialien zu akzeptieren oder zu
            berücksichtigen, außer denen, die wir ausdrücklich angefordert haben
            und für die bestimmte spezifische Bedingungen und Anforderungen
            gelten können. So vermeiden Sie Missverständnisse, wenn Ihre Ideen
            denen ähneln, die wir entwickelt haben oder unabhängig entwickeln.
            Wenn Sie sich trotz unserer Richtlinie dafür entscheiden, uns
            Inhalte, Informationen, Ideen, Vorschläge oder andere Materialien zu
            senden, stimmen Sie außerdem Folgendem zu:
          </p>
          <p>
            Für alle Bewertungen, Kommentare, Rückmeldungen, Postkarten,
            Vorschläge, Ideen und andere Einsendungen, die uns über unseren
            Service, unsere Websites, per E-Mail oder Telefon, per Post oder
            anderweitig offengelegt, übermittelt oder angeboten werden im
            Zusammenhang mit Ihrer Nutzung dieses Dienstes (zusammenfassend
            „Benutzerbeiträge“) gewähren Sie uns ein gebührenfreies,
            unwiderrufliches, übertragbares Recht und eine Lizenz zur Nutzung
            der Benutzerbeiträge, wie wir es wünschen, einschließlich, aber
            nicht beschränkt auf das Kopieren, Ändern und Löschen darin diese
            Benutzerbeiträge vollständig, anzupassen, zu veröffentlichen, zu
            übersetzen, daraus abgeleitete Werke zu erstellen und/oder solche
            Benutzerbeiträge zu verkaufen und/oder zu verteilen und/oder solche
            Benutzerbeiträge in jedwede Form, Medium oder Technologie auf der
            ganzen Welt zu integrieren.
          </p>
          <p>
            Wir sind berechtigt, alle von Ihnen eingereichten Benutzerbeiträge
            für jeden Zweck ohne Einschränkung und ohne Sie in irgendeiner Weise
            zu entschädigen, zu verwenden, zu reproduzieren, offenzulegen, zu
            modifizieren, anzupassen, abgeleitete Werke davon zu erstellen, zu
            veröffentlichen, anzuzeigen und zu verbreiten. Wir sind und bleiben
            nicht verpflichtet, (1) Benutzerbeiträge vertraulich zu behandeln;
            (2) dem Benutzer eine Entschädigung für Benutzerbeiträge zu zahlen;
            oder (3) um auf Benutzerbeiträge zu antworten. Sie erklären sich
            damit einverstanden, dass alle von Ihnen an uns übermittelten
            Benutzerbeiträge keine Rechte Dritter verletzen, einschließlich,
            aber nicht beschränkt auf Urheberrechte, Markenrechte,
            Datenschutzrechte oder andere persönliche oder Eigentumsrechte, und
            niemandem Schaden zufügen oder juristische Person. Sie stimmen
            ferner zu, dass keine von Ihnen an uns übermittelten
            Benutzerbeiträge verleumderisches oder anderweitig rechtswidriges,
            bedrohliches, missbräuchliches oder obszönes Material sind oder
            enthalten oder Softwareviren, politische Kampagnen, kommerzielle
            Werbung, Kettenbriefe, Massenmails oder jede Form von „Spam“
            enthalten.
          </p>
          <p>
            Durch die Nutzung dieses Dienstes stimmen Sie den oben genannten
            Bedingungen in Bezug auf Benutzerbeiträge zu. Bitte beachten Sie,
            dass Benutzerbeiträge unter keinen Umständen als Benutzerinhalte im
            Sinne von Absatz 1, Unterabschnitt b gelten. in diesem Abschnitt.
          </p>
        </li>
      </ol>
      <h3 className="heading-3">
        Melden von Urheberrechts- und anderen IP-Verletzungen
      </h3>
      <p>
        Es ist unsere Richtlinie, auf Mitteilungen über mutmaßliche
        Urheberrechtsverletzungen zu reagieren, die dem "Bundesgesetz über das
        Urheberrecht und verwandte Schutzrechte" entsprechen. Wenn Sie der
        Meinung sind, dass Ihre Arbeit auf eine Weise kopiert wurde, die eine
        Urheberrechtsverletzung darstellt, senden Sie bitte eine Mitteilung mit
        allen folgenden Informationen an unseren Urheberrechtsbeauftragten:
      </p>
      <ol>
        <li>
          Eine elektronische oder physische Unterschrift der Person, die befugt
          ist, im Namen des Inhabers des Urheberrechtsinteresses zu handeln;
        </li>
        <li>
          Eine Beschreibung des urheberrechtlich geschützten Werks, von dem Sie
          behaupten, dass es verletzt wurde;
        </li>
        <li>
          Eine Beschreibung, wo sich das Material, von dem Sie behaupten, dass
          es eine Verletzung darstellt, auf unseren Websites befindet;
        </li>
        <li>Ihre Adresse, Telefonnummer und E-Mail-Adresse;</li>
        <li>
          Eine Erklärung von Ihnen, dass Sie nach Treu und Glauben der Ansicht
          sind, dass die strittige Nutzung nicht vom Urheberrechtsinhaber,
          seinem Vertreter oder dem Gesetz genehmigt wurde; Und
        </li>
        <li>
          Eine eidesstattliche Erklärung von Ihnen, dass die obigen
          Informationen in Ihrer Mitteilung korrekt sind und dass Sie der
          Urheberrechtsinhaber sind oder befugt sind, im Namen des
          Urheberrechtsinhabers zu handeln.
        </li>
      </ol>

      <h3 className="heading-3">Gewährleistungsausschluss</h3>
      <p>
        DER SERVICE, EINSCHLIESSLICH UND OHNE EINSCHRÄNKUNG UNSERER INHALTE,
        WIRD „OHNE MÄNGELGEWÄHR“, „WIE VERFÜGBAR“ UND „MIT ALLEN FEHLERN“
        BEREITGESTELLT. SOWEIT GESETZLICH ZULÄSSIG, GEBEN WEDER WIR NOCH UNSERE
        MITARBEITER, MANAGER, FÜHRUNGSKRÄFTE, AUFTRAGNEHMER, LIEFERANTEN,
        LIZENZGEBER ODER VERTRETER (ZUSAMMEN DIE „ELENO-PARTEIEN“)
        ZUSICHERUNGEN, GEWÄHRLEISTUNGEN ODER ZUSICHERUNGEN JEGLICHER ART
        AUSDRÜCKLICH AB ODER STILLSCHWEIGEND, HINSICHTLICH: (A) DER DIENSTE; (B)
        UNSERE INHALTEN; (C) NUTZERINHALTEN; ODER (D) SICHERHEIT IM ZUSAMMENHANG
        MIT DER ÜBERTRAGUNG VON INFORMATIONEN AN UNS ODER ÜBER DEN SERVICE.
        DARÜBER HINAUS SCHLIESSEN DIE ELENO-PARTEIEN HIERMIT ALLE AUSDRÜCKLICHEN
        ODER STILLSCHWEIGENDEN GEWÄHRLEISTUNGEN AUS, EINSCHLIESSLICH, ABER NICHT
        BESCHRÄNKT AUF DIE GEWÄHRLEISTUNG DER MARKTFÄHIGKEIT, EIGNUNG FÜR EINEN
        BESTIMMTEN ZWECK, NICHTVERLETZUNG VON RECHTEN DRITTER, TITEL, ZWECK,
        HANDEL, LEISE GENUSS, SYSTEMINTEGRATION UND FREIHEIT VOM COMPUTERVIRUS.
      </p>
      <p>
        DIE ELENO-PARTEIEN GEWÄHRLEISTEN NICHT, DASS DER SERVICE FEHLERFREI ODER
        UNUNTERBROCHEN IST; DASS MÄNGEL BEHOBEN WERDEN; ODER DASS DER DIENST
        ODER DER SERVER, DER DEN DIENST ZUR VERFÜGUNG STELLT, FREI VON
        SCHÄDLICHEN KOMPONENTEN IST, EINSCHLIESSLICH, OHNE EINSCHRÄNKUNG, VIREN
        UND SICHERHEITSVERLETZUNGEN JEGLICHER ART. DIE ELENO-PARTEIEN GEBEN
        KEINERLEI ZUSICHERUNGEN ODER GEWÄHRLEISTUNGEN, DASS DIE INFORMATIONEN
        (EINSCHLIESSLICH JEGLICHER ANLEITUNGEN) ÜBER DEN DIENST GENAU,
        VOLLSTÄNDIG ODER NÜTZLICH SIND. SIE ERKENNEN AN, DASS IHRE NUTZUNG DES
        DIENSTES AUF IHR EIGENES RISIKO ERFOLGT. DIE ELENO-PARTEIEN
        GEWÄHRLEISTEN NICHT, DASS IHRE NUTZUNG DES DIENSTES IN EINER BESTIMMTEN
        GERICHTSBARKEIT RECHTMÄSSIG IST, UND DIE ELENO-PARTEIEN SCHLIESSEN
        SOLCHE GEWÄHRLEISTUNGEN AUSDRÜCKLICH AUS. EINIGE GERICHTSBARKEITEN
        BESCHRÄNKEN ODER ERLAUBEN DEN AUSSCHLUSS STILLSCHWEIGENDER ODER ANDERER
        GEWÄHRLEISTUNGEN NICHT, SO DASS DER OBENSTEHENDE HAFTUNGSAUSSCHLUSS
        MÖGLICHERWEISE NICHT AUF SIE ANWENDBAR IST, SOWEIT DAS RECHT DIESER
        GERICHTSBARKEIT AUF SIE UND DIESE NUTZUNGSBEDINGUNGEN ANWENDBAR IST.
      </p>
      <p>
        INDEM SIE AUF DEN DIENST ZUGREIFEN ODER DEN DIENST NUTZEN, GEWÄHRLEISTEN
        SIE, DASS IHRE AKTIVITÄTEN IN JEDER GERICHTSBARKEIT RECHTMÄSSIG SIND, WO
        SIE AUF DEN DIENST ZUGREIFEN ODER DEN DIENST NUTZEN.
      </p>
      <p>
        DIE ELENO-PARTEIEN UNTERSTÜTZEN KEINEN INHALT UND SCHLIESSEN
        AUSDRÜCKLICH JEGLICHE VERANTWORTUNG ODER HAFTUNG GEGENÜBER PERSONEN ODER
        JEGLICHER PERSONEN FÜR VERLUSTE, SCHÄDEN (OB TATSÄCHLICH, FOLGE, STRAFE
        ODER ANDERWEITIG), VERLETZUNGEN, ANSPRÜCHE, HAFTUNG ODER SONSTIGE
        URSACHEN JEGLICHER ART ODER CHARAKTERS AUS AUF ODER RESULTIEREND AUS
        INHALTEN.
      </p>
      <h3 className="heading-3">Lizenzbeschränkungen</h3>
      <p>
        JEDER VERSUCH DURCH SIE, DEN SERVICE ZU STÖREN ODER ZU BEEINFLUSSEN,
        EINSCHLIESSLICH DER UNTERGRABUNG ODER MANIPULATION DES RECHTMÄSSIGEN
        BETRIEBES EINER UNSERER WEBSEITEN ODER EINES UNSERES SERVICES STELLT
        EINE VERLETZUNG UNSERER RICHTLINIEN UND KANN EINE VERLETZUNG VON STRAF-
        UND ZIVILRECHTEN DARSTELLEN.
      </p>
      <p>
        OHNE EINSCHRÄNKUNG ANDERER RECHTSMITTEL KÖNNEN WIR KONTEN ODER DEN
        ZUGRIFF AUF DEN DIENST ODER TEILE DAVON EINSCHRÄNKEN, AUSSETZEN,
        KÜNDIGEN, ÄNDERN ODER LÖSCHEN, WENN SIE EINE ODER MEHRERE
        NUTZUNGSBEDINGUNGEN NICHT EINHALTEN ODER IM VERDACHT STEHEN ODER DER
        VERDACHT AUF ILLEGALE ODER UNSACHGEMÄSSE NUTZUNG DES DIENSTES BESTEHT,
        MIT ODER OHNE BENACHRICHTIGUNG AN SIE. SIE KÖNNEN IHR KONTO UND JEGLICHE
        BENUTZERINHALTE INFOLGE DER KÜNDIGUNG ODER EINSCHRÄNKUNG DES KONTOS
        SOWIE ALLE VORTEILE, PRIVILEGIEN, VERDIENTEN GEGENSTÄNDE UND GEKAUFTE
        GEGENSTÄNDE IM ZUSAMMENHANG MIT IHRER NUTZUNG DES DIENSTES VERLIEREN,
        UND WIR SIND NICHT VERPFLICHTET, SIE FÜR SOLCHE VERLUSTE ODER ERGEBNISSE
        ZU ENTSCHÄDIGEN
      </p>
      <p>
        OHNE EINSCHRÄNKUNG UNSERER ANDEREN RECHTSMITTEL KÖNNEN WIR DEN SERVICE
        UND BENUTZERKONTEN ODER TEILE DAVON EINSCHRÄNKEN, AUSSETZEN ODER
        BEENDEN, DEN ZUGRIFF AUF UNSERE SERVICES UND WEBSEITEN UND IHRE INHALTE
        UND TOOLS VERBIETEN, GEHOSTETE INHALTE VERZÖGERN ODER ENTFERNEN UND
        TECHNISCHE UND RECHTLICHE MASSNAHMEN ERGREIFEN ODER BENUTZER AM ZUGRIFF
        AUF DEN DIENST HINDERN, WENN WIR DER ANSICHT SIND, DASS SIE RISIKEN ODER
        MÖGLICHE RECHTLICHE VERPFLICHTUNGEN SCHAFFEN, DIE GEISTIGE
        EIGENTUMSRECHTE DRITTER VERLETZEN ODER IM WIDERSPRUCH MIT DEM WORT ODER
        GEIST UNSERER BEDINGUNGEN ODER RICHTLINIEN HANDELN. ZUSÄTZLICH KÖNNEN
        WIR UNTER ENTSPRECHENDEN UMSTÄNDEN UND NACH UNSEREM ALLEINIGEN ERMESSEN
        KONTEN VON BENUTZERN AUSSETZEN ODER KÜNDIGEN, DIE MÖGLICHERWEISE GEGEN
        GEISTIGE EIGENTUMSRECHTE DRITTER VERSTOSSEN.
      </p>
      <p>
        Wir behalten uns das Recht vor, das Angebot und/oder den Support des
        Dienstes oder eines bestimmten Teils des Dienstes jederzeit dauerhaft
        oder vorübergehend einzustellen. In einem solchen Fall sind wir nicht
        verpflichtet, den Benutzern im Zusammenhang mit solchen eingestellten
        Teilen des Dienstes Rückerstattungen, Vorteile oder andere
        Entschädigungen zu leisten.
      </p>
      <h3 className="heading-3">Haftungsbeschränkung; Verzicht</h3>
      <p>
        UNTER KEINEN UMSTÄNDEN HAFTEN DIE ELENO-PARTEIEN IHNEN GEGENÜBER FÜR
        VERLUSTE ODER SCHÄDEN JEGLICHER ART (EINSCHLIESSLICH UND OHNE
        EINSCHRÄNKUNG FÜR DIREKTE, INDIREKTE, WIRTSCHAFTLICHE, BEISPIELHAFTE,
        SONDER-, STRAF-, ZUFÄLLIGE ODER FOLGESCHÄDEN), DIE DIREKT ENTSTEHEN ODER
        IN DIREKTEM SIND ZUSAMMENHANG MIT: (A) DEM DIENST; (B) UNSERE INHALTE;
        (C) NUTZERINHALTE; (D) IHRE NUTZUNG, UNMÖGLICHKEIT DER NUTZUNG ODER DIE
        LEISTUNG DES DIENSTES; (E) JEGLICHE MASSNAHMEN IM ZUSAMMENHANG MIT EINER
        UNTERSUCHUNG DURCH DIE ELENO-PARTEIEN ODER STRAFVERFOLGUNGSBEHÖRDEN IN
        BEZUG AUF IHRE NUTZUNG ODER DIE NUTZUNG DES DIENSTES DURCH DRITTE; (F)
        MASSNAHMEN IM ZUSAMMENHANG MIT URHEBERRECHTEN ODER ANDEREN INHABERN VON
        GEISTIGEM EIGENTUM; (G) JEGLICHE FEHLER ODER AUSLASSUNGEN BEIM BETRIEB
        DES DIENSTES; ODER (H) SCHÄDEN AM COMPUTER, MOBILEN GERÄT ODER ANDEREN
        GERÄTEN ODER TECHNOLOGIEN EINES BENUTZERS, EINSCHLIESSLICH, OHNE
        EINSCHRÄNKUNG, SCHÄDEN DURCH SICHERHEITSVERLETZUNGEN ODER DURCH VIREN,
        MANIPULATIONEN, BETRUG, FEHLER, AUSLASSUNGEN, UNTERBRECHUNGEN, DEFEKTE,
        VERZÖGERUNGEN BETRIEBS- ODER ÜBERTRAGUNGSFEHLER, COMPUTERLEITUNGS- ODER
        NETZWERKFEHLER ODER ANDERE TECHNISCHE ODER SONSTIGE FEHLFUNKTIONEN,
        EINSCHLIESSLICH, OHNE EINSCHRÄNKUNG, SCHADENSERSATZ FÜR ENTGANGENEN
        GEWINN, GESCHÄFTSVERLUST, DATENVERLUST, ARBEITSUNTERBRECHUNG,
        GENAUIGKEIT DER ERGEBNISSE ODER COMPUTERAUSFALL ODER FEHLFUNKTION,
        SELBST WENN VORHERSEHBAR ODER SELBST WENN DIE ELENO-PARTEIEN AUF DIE
        MÖGLICHKEIT SOLCHER SCHÄDEN HINGEWIESEN WURDEN ODER HÄTTEN WISSEN
        MÜSSEN, OB AUF VERTRAGSHANDLUNG, FAHRLÄSSIGKEIT, GEFAHRENHAFTIGE HAFTUNG
        ODER DELIKT (EINSCHLIESSLICH, OHNE EINSCHRÄNKUNG, OB GANZ ODER TEILWEISE
        DURCH FAHRLÄSSIGKEIT VERURSACHT, HÖHERE GEWALT, AUSFALL DER
        TELEKOMMUNIKATION ODER DIEBSTAHL ODER ZERSTÖRUNG DES DIENSTES). IN
        KEINEM FALL HAFTEN DIE ELENO-PARTEIEN IHNEN ODER ANDEREN GEGENÜBER FÜR
        VERLUSTE, SCHÄDEN ODER VERLETZUNGEN, EINSCHLIESSLICH, OHNE
        EINSCHRÄNKUNG, TOD ODER PERSONENSCHÄDEN. EINIGE STAATEN LASSEN DEN
        AUSSCHLUSS ODER DIE BESCHRÄNKUNG VON ZUFÄLLIGEN ODER FOLGESCHÄDEN NICHT
        ZU, SO DASS DIE OBEN GENANNTE EINSCHRÄNKUNG ODER DER AUSSCHLUSS
        MÖGLICHERWEISE NICHT FÜR SIE ZUTRIFFT. IN KEINEM FALL ÜBERSTEIGT DIE
        GESAMTHAFTUNG DER ELENO-PARTEIEN IHNEN GEGENÜBER FÜR ALLE SCHÄDEN,
        VERLUSTE ODER URSACHEN ODER MASSNAHMEN EINHUNDERT US-DOLLAR (100,00 $).
      </p>
      <p>
        SIE STIMMEN ZU, DASS FÜR DEN FALL, DASS IHNEN SCHÄDEN, VERLUSTE ODER
        VERLETZUNGEN DURCH UNSERE HANDLUNGEN ODER UNTERLASSUNGEN ENTSTEHEN, DIE
        IHNEN GEGEBENENFALLS SCHÄDEN NICHT REPARIERBAR ODER AUSREICHEND SIND, UM
        SIE ZU EINER UNTERSUCHUNG ZU BERECHTIGEN, DIE JEGLICHE NUTZUNG EINER
        WEBSITE VERHINDERT SITE, SERVICE, EIGENTUM, PRODUKT ODER ANDERE INHALTE,
        DIE DEN ELENO-PARTEIEN BESITZEN ODER KONTROLLIERT SIND, UND SIE HABEN
        KEINE RECHTE, DIE ENTWICKLUNG, PRODUKTION, VERTEILUNG, WERBUNG,
        AUSSTELLUNG ODER NUTZUNG VON WEBSITE, EIGENTUM, PRODUKT ZU VERBOTEN ODER
        ZU BESCHRÄNKEN , SERVICE ODER SONSTIGE INHALTE, DIE SICH IM BESITZ
        BEFINDEN ODER VON DEN ELENO-PARTEIEN KONTROLLIERT WERDEN.
      </p>
      <p>
        WIR SIND NICHT VERANTWORTLICH FÜR DIE AKTIONEN, INHALTE, INFORMATIONEN
        ODER DATEN DRITTER, UND SIE STELLEN DIE ELENO-PARTEIEN VON JEGLICHEN
        ANSPRÜCHEN UND SCHÄDEN, BEKANNT UND UNBEKANNT, FREI, DIE SICH AUS ODER
        IN IRGENDEINER WEISE IM ZUSAMMENHANG MIT ANSPRÜCHEN ERGEBEN, DIE SIE
        GEGEN SOLCHE DRITTE HABEN.
      </p>
      <h3 className="heading-3">Absicherung</h3>
      <p>
        Sie (und auch jeder Dritte, für den Sie ein Konto oder eine Aktivität
        auf dem Service betreiben) erklären sich damit einverstanden, die
        Eleno-Parteien (auf unser Verlangen) zu verteidigen, schadlos zu halten
        und schadlos zu halten von und gegen alle Ansprüche, Verbindlichkeiten,
        Schäden, Verluste und Ausgaben, einschließlich, aber nicht beschränkt
        auf angemessene Anwaltsgebühren und -kosten, die sich aus Folgendem
        ergeben oder in irgendeiner Weise damit zusammenhängen (einschließlich
        als Ergebnis Ihrer direkten Aktivitäten im Rahmen des Dienstes oder der
        in Ihrem Namen durchgeführten Aktivitäten):
      </p>
      <ol>
        <li>
          Ihre Inhalte oder Ihr Zugriff auf oder Ihre Nutzung des Dienstes;
        </li>
        <li>Ihre Verletzung oder angebliche Verletzung dieser Bedingungen;</li>
        <li>
          Ihre Verletzung von Rechten Dritter, einschließlich, aber nicht
          beschränkt auf Rechte an geistigem Eigentum, Publizitäts-,
          Vertraulichkeits-, Eigentums- oder Datenschutzrechten;
        </li>
        <li>
          Ihre Verletzung von Gesetzen, Regeln, Vorschriften, Kodizes,
          Satzungen, Verordnungen oder Anordnungen von Regierungs- und
          Quasi-Regierungsbehörden, einschließlich, aber nicht beschränkt auf
          alle Regulierungs-, Verwaltungs- und Gesetzgebungsbehörden; oder
        </li>
        <li>jede von Ihnen gemachte falsche Darstellung.</li>
      </ol>
      <p>
        Sie werden bei der Abwehr von Ansprüchen in vollem Umfang mit uns
        zusammenarbeiten. Wir behalten uns das Recht vor, die ausschließliche
        Verteidigung und Kontrolle über alle Angelegenheiten zu übernehmen, die
        Ihrer Entschädigung unterliegen, und Sie werden in keinem Fall Ansprüche
        ohne unsere vorherige schriftliche Zustimmung begleichen. Ungeachtet des
        Vorstehenden stimmen Sie zu, dass die Kosten einer solchen Verteidigung
        ausschließlich von Ihnen getragen werden.
      </p>
      <h3 className="heading-3">Schiedsverfahren</h3>
      <p>
        Außer wenn Sie sich abmelden oder bei Streitigkeiten in Bezug auf Ihr
        oder unser geistiges Eigentum (wie Marken, Handelsaufmachungen,
        Domainnamen, Geschäftsgeheimnisse, Urheberrechte und Patente), stimmen
        Sie zu, dass alle Streitigkeiten zwischen Ihnen und uns (unabhängig
        davon, ob eine solche Streitigkeit einen Dritten betrifft oder nicht) in
        Bezug auf Ihre Beziehung zu uns, einschließlich, aber nicht beschränkt
        auf Streitigkeiten im Zusammenhang mit diesen Bedingungen, Ihrer Nutzung
        des Dienstes und/oder Rechten auf Privatsphäre und/oder
        Veröffentlichung, werden verbindlich beigelegt , und Sie und wir
        verzichten hiermit ausdrücklich auf ein Geschworenenverfahren. Sie
        können Ansprüche nur in Ihrem eigenen Namen geltend machen. Weder Sie
        noch wir werden an einer Sammelklage oder Sammelklagen teilnehmen. Sie
        stimmen auch zu, sich nicht an Ansprüchen zu beteiligen, die von einem
        Privatanwalt in allgemeiner oder repräsentativer Eigenschaft vorgebracht
        werden, oder an konsolidierten Ansprüchen, die das Konto einer anderen
        Person betreffen, wenn wir eine Partei des Verfahrens sind. Das Urteil
        über den Schiedsspruch des Schiedsrichters kann bei jedem zuständigen
        Gericht eingereicht werden. Ungeachtet aller Bestimmungen des
        anwendbaren Rechts ist der Schiedsrichter nicht befugt, Schadensersatz,
        Rechtsbehelfe oder Schiedssprüche zu gewähren, die diesen Bedingungen
        widersprechen.
      </p>
      <p>
        Sie können dieser Schlichtungsvereinbarung, wie oben angegeben,
        widersprechen. In diesem Fall können weder Sie noch wir die Teilnahme an
        einem Schlichtungsverfahren verlangen. Um sich abzumelden, müssen Sie
        uns innerhalb von 30 Tagen nach dem Datum, an dem Sie zum ersten Mal
        dieser Schlichtungsbestimmung unterliegen, schriftlich benachrichtigen.
        Sie müssen diese Adresse verwenden, um sich abzumelden:
      </p>
      <p>
        Brian Boy <br />
        der seitenschneider <br />
        Tanneggweg 12 <br />
        CH-3604 Thun <br />
        Switzerland
      </p>
      <p>
        Sie müssen Ihren Namen und Ihre Wohnadresse, die Telefonnummer und den
        Benutzernamen, die Sie für Ihr Konto verwenden, und eine klare Erklärung
        angeben, dass Sie dieser Schlichtungsvereinbarung widersprechen möchten.
      </p>
      <p>
        Wenn sich herausstellt, dass das oben enthaltene Verbot von Sammelklagen
        und anderen Ansprüchen im Namen Dritter nicht durchsetzbar ist, sind
        alle vorstehenden Ausführungen in diesem Abschnitt zu Schiedsverfahren
        null und nichtig. Diese Schlichtungsvereinbarung gilt auch nach
        Beendigung Ihrer Beziehung zu uns.
      </p>
      <h3 className="heading-3">Verjährung von Ansprüchen</h3>
      <p>
        Sie stimmen zu, dass alle Ansprüche, die Sie möglicherweise aus oder im
        Zusammenhang mit Ihrer Beziehung zu uns haben, innerhalb eines Jahres
        nach Entstehung eines solchen Anspruchs geltend gemacht werden müssen;
        andernfalls ist Ihr Anspruch dauerhaft verjährt.
      </p>
      <h3 className="heading-3">Geltendes Recht & Gerichtsstand</h3>
      <p>
        Diese Bedingungen unterliegen den Gesetzen der Schweizerischen
        Eidgenossenschaft und werden in Übereinstimmung mit diesen ausgelegt,
        ohne dass die Grundsätze des Kollisionsrechts wirksam werden, UND
        UNTERLIEGEN AUSDRÜCKLICH NICHT DEN ÜBEREINKOMMEN DER VEREINTEN NATIONEN
        ÜBER VERTRÄGE ÜBER DEN INTERNATIONALEN WARENVERKAUF, FALLS ANDERSWEITIG
        ZUTREFFEND. Für alle Rechts- oder Billigkeitsklagen im Zusammenhang mit
        der Schiedsbestimmung dieser Bedingungen, den ausgeschlossenen
        Streitigkeiten oder wenn Sie sich von der Schiedsvereinbarung abmelden,
        erklären Sie sich damit einverstanden, alle Streitigkeiten, die Sie mit
        uns haben, ausschließlich vor einem kantonalen oder eidgenössischen
        Gericht in der Schweiz beizulegen, und sich der persönlichen
        Gerichtsbarkeit der Gerichte in der Schweiz zu unterwerfen, um alle
        derartigen Streitigkeiten zu führen.
      </p>
      <h3 className="heading-3">Kündigung</h3>
      <p>
        Wir können diese Vereinbarung jederzeit mit oder ohne Vorankündigung aus
        beliebigem Grund kündigen.
      </p>
      <h3 className="heading-3">
        Salvatorische Klausel und keine Verzichtserklärung
      </h3>
      <p>
        Wenn eine Bestimmung dieser Bedingungen während eines Schiedsverfahrens
        oder von einem zuständigen Gericht für rechtswidrig, nichtig oder aus
        irgendeinem Grund nicht durchsetzbar befunden wird, gilt diese
        Bestimmung als von diesen Bedingungen trennbar und berührt nicht die
        Gültigkeit und Durchsetzbarkeit der verbleibenden Bestimmungen. Unser
        Versäumnis, auf der strengen Einhaltung einer Bestimmung dieser
        Bedingungen zu bestehen oder diese durchzusetzen, wird nicht als
        Verzicht auf eine Bestimmung oder ein Recht ausgelegt. Kein Verzicht auf
        eine dieser Bedingungen gilt als weiterer oder fortgesetzter Verzicht
        auf diese Bedingung oder Bedingung oder eine andere Bedingung oder
        Bedingung.
      </p>
      <h3 className="heading-3">Ganze Vereinbarung</h3>
      <p>
        Wenn Sie den Dienst im Namen einer juristischen Person nutzen, erklären
        Sie, dass Sie berechtigt sind, im Namen dieser juristischen Person einen
        Vertrag abzuschließen. Diese Bedingungen stellen die gesamte
        Vereinbarung zwischen Ihnen und uns dar und regeln Ihre Nutzung des
        Dienstes und ersetzen alle vorherigen Vereinbarungen zwischen Ihnen und
        uns. Ohne unsere vorherige schriftliche Zustimmung werden Sie die
        Bedingungen weder freiwillig noch kraft Gesetzes ganz oder teilweise
        abtreten oder Rechte abtreten oder Verpflichtungen hierunter delegieren.
        Jede angebliche Abtretung oder Delegierung durch Sie ohne unsere
        entsprechende vorherige schriftliche Zustimmung ist null und nichtig.
        Wir können diese Bedingungen oder Rechte hierunter ohne Ihre Zustimmung
        abtreten, und die Bedingungen kommen unserem Rechtsnachfolger zugute und
        sind von ihm durchsetzbar. Weder die Verhaltensweisen zwischen den
        Parteien noch die Handelspraxis wirken sich auf eine Änderung der
        Bedingungen aus. Diese Bedingungen verleihen keine Rechte Dritter.
      </p>
      <h3 className="heading-3">Gebietsbeschränkungen</h3>
      <p>
        Die im Rahmen des Dienstes bereitgestellten Informationen sind nicht für
        die Weitergabe an oder die Nutzung durch Personen oder Organisationen in
        Rechtsordnungen oder Ländern bestimmt, in denen eine solche Weitergabe
        oder Nutzung gegen Gesetze oder Vorschriften verstoßen würde oder die
        uns einer Registrierungspflicht in einer solchen Rechtsordnung oder
        einem solchen Land unterwerfen würden. Wir behalten uns das Recht vor,
        die Verfügbarkeit des Dienstes oder eines Teils des Dienstes jederzeit
        und nach eigenem Ermessen auf Personen, geografische Gebiete oder
        Gerichtsbarkeiten zu beschränken und die Mengen von Inhalten,
        Programmen, Produkten, Dienst oder andere von uns bereitgestellte
        Funktionen einzuschränken.
      </p>
      <p>
        Software, die mit dem Service in Verbindung steht oder von diesem
        bereitgestellt wird, kann den Exportkontrollen der Schweiz unterliegen.
        Daher darf keine Software aus dem Service heruntergeladen, exportiert
        oder reexportiert werden: (a) in (oder an einen Staatsangehörigen oder
        Einwohner von) einem Land, für das die Schweiz ein Warenembargo verhängt
        haben; Durch das Herunterladen von Software im Zusammenhang mit dem
        Dienst versichern und garantieren Sie, dass Sie sich nicht in einem
        solchen Land befinden, nicht unter der Kontrolle eines solchen Landes
        oder auf einer solchen Liste stehen, kein Staatsangehöriger oder
        Einwohner eines solchen Landes sind.
      </p>
      <p>
        Diese allgemeinen Geschäftsbedingungen wurden in Deutsch verfasst.
        Soweit eine übersetzte Version dieser Nutzungsbedingungen mit der
        deutschen Version in Konflikt steht, gilt die deutsche Version.
      </p>
    </div>
  )
}

export default TermsAndConditions
